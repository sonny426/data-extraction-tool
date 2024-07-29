from celery import shared_task
from core.film.models import Film
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import logging
import json

from core.cookie.models import Cookie
from core.task_log.models import TaskLog

logger = logging.getLogger(__name__)


def MyRequest(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Priority': 'u=0, i',
        'Cookie': Cookie.objects.latest('created_at').cookie,
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    }

    # Make the request
    response = requests.get(url, headers=headers).content
    return response

@shared_task
def check_and_update_films():
    new_film = Film.objects.filter(need_scrape=True).first()
    if new_film is None:
        return
    task_log = TaskLog.objects.create(scrape_link = new_film.link, status='STARTED')

    # Start scraping the film data
    response = MyRequest(new_film.link)
    soup = BeautifulSoup(response, 'html.parser')
    try:
        TITLE = soup.find('div', {'class': 'new-header-wrap-2'}).find('h1').text.strip()
    except Exception as e:
        task_log.status = 'FAILURE'
        task_log.result = str(e)
        if len(task_log.result) > 255:
            task_log.result = task_log.result[:255]
        task_log.save()
        raise e

    try:
        data = soup.find('table', {'class': 'p18table1'}).find('tbody').find('tr').find_all('td')
    except:
        data = ''
    try:
        STUDIO = ','.join([_.text.strip() for _ in data[0].find_all('a')])
    except:
        STUDIO = ''
    try:
        GENRE = ','.join([_.text.strip() for _ in data[1].find_all('a')])
    except:
        GENRE = ''
    try:
        ARENA = ','.join([_.text.strip() for _ in data[2].find_all('a')])
    except:
        ARENA = ''
    try:
        MODIFIED_ON = data[3].text.strip()
    except:
        MODIFIED_ON = '1970-04-01'
    try:
        SEASON = soup.find('div', {'class': 'prd-detailsleft'}).find(lambda tag: 'SEASON' in tag.get_text()).find('span').text.strip()
    except:
        SEASON = ''
    try:
        STATUS = soup.find('div', {'class': 'prd-detailsleft'}).find(lambda tag: 'STATUS' in tag.get_text()).find('span').text.strip()
    except:
        STATUS = ''
    try:
        data_cells = soup.find_all('div', {'class': 'p18rsec'})
    except:
        data_cells = ''

    try:
        NETWORKS = []
        _NETWORK = ''
        for data in data_cells:
            data = data.find_all('p')
            try:
                for b_tag in data[2].find_all('b'):
                    b_tag.decompose()
                for br_tag in data[2].find_all('br'):
                    br_tag.decompose()
                NETWORKS.append([data[0].find('a')['href'], data[1].text.strip(), data[2].text.strip(), data[-2].text.strip()])
            except:
                continue
        for index, NETWORK in enumerate(NETWORKS):
            try:
                link = 'https://filmandtv.luminatedata.com/' + NETWORK[0]
                response = MyRequest(link)
                soup = BeautifulSoup(response, 'html.parser')
                COMPANY = soup.find('div', {'class': 'new-header-wrap-2'}).find('h1').text.strip()
                if index == 0:
                    _NETWORK += '(i). '
                if index == 1:
                    _NETWORK += '(ii). '
                if index == 2:
                    _NETWORK += '(iii). '
                if index == 3:
                    _NETWORK += '(iv). '
                if index == 4:
                    _NETWORK += '(v). '
                _NETWORK += COMPANY + ' | ' + NETWORK[1] + ' | ' + NETWORK[2] + ' '

                if index == 0:
                    if NETWORK[3][0] >= '0' and NETWORK[3][0] <= '9':
                        _NETWORK += ' | ' + NETWORK[3] + '. '
                    else:
                        _NETWORK += '. '
            except:
                continue
    except:
        _NETWORK = ''
    new_film.title = TITLE
    new_film.studio = STUDIO
    new_film.genre = GENRE
    new_film.arena = ARENA
    new_film.modified_at = datetime.strftime(datetime.strptime(MODIFIED_ON, '%m-%d-%Y'), '%Y-%m-%d %H:%M:%S')
    new_film.season = SEASON
    new_film.status = STATUS
    new_film.need_scrape = False
    new_film.network = _NETWORK
    new_film.save()

    task_log.status = 'SUCCESS'
    task_log.result = new_film.link
    task_log.save()

    return 'Checked and updated films'