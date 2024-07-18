from celery import shared_task
from core.film.models import Film
import requests
from bs4 import BeautifulSoup
from datetime import datetime

import logging
import json

logger = logging.getLogger(__name__)

def MyRequest(cookie, url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Priority': 'u=0, i',
        'Cookie': cookie,
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
    cookie = "cook_autovisit=229fe602662a1f55c60e63af2c6d0aa4; _gcl_au=1.1.1518389169.1717424536; _mkto_trk=id:319-SAP-104&token:_mch-luminatedata.com-1717424536399-88663; _ga=GA1.1.2002600592.1717424538; addevent_track_cookie=35fcc815-71b7-49be-b842-4d6a69660ac9; _ga_3ESV50XWME=GS1.1.1717450761.1.1.1717451269.60.0.0; home_page_tab=tab_dei; ci_session=VpjjbYZoEWGFXo7AEXLzld0FQ9UjY7y%2BcK19J3YsfQqWm5OSjZoAB%2BLmr%2F%2BIle3ijN3We1YTpu4wOZJrCt0XfrcO6zYziR1Fv8FZodv8xDmBBoKXOnt0dQqhyaYHTOKcZLuZGOuXRI9vUu0Y5rE5QSjEnH7gvGbL93JES%2B05NEv2tgL9XrAhaySUiwRQt1j3WvsLgBiCQthRRrrIJlOxJJm4Jwmwfv9U6xFz3x1y%2BfL%2Byv%2Bp9g9VwffsF4vDNFbAWx7JRp%2B0yGBFQvL%2FUnnUO%2BaNVS5GoOLsDGQAFZJBAoSrzvAXv%2F57gfe7K9UZfSUq%2BFHFrJvCZ4qaMgnmuurueP3%2BWk0eF80PNcrLiD%2FhswfWwaKUJ1jWc43Zfx2UDr0ld4U8j4h2MYlHy2QU4MAu%2B%2FP3aZZ3xVGNstBVAp1yG%2FM%3D; PHPSESSID=j66a70k6s6vlvjtfs7g60dpemc; cook_autologin=11c7be830df2319efe425d12663c6342; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jul+11+2024+11%3A36%3A33+GMT-0400+(Eastern+Daylight+Time)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&AwaitingReconsent=false&groups=C0002%3A1%2CC0004%3A1%2CC0001%3A1%2CC0003%3A1; _ga_PDQYBV3900=GS1.1.1720712196.28.0.1720712198.0.0.0; AWSALB=rBVyQQc2Faw0PXCJBAizFC6UJjiCFXJe5eEsab2MeCOUigIiGmxRMb2fSBqyupNxB0G0IO0jy5BLaP+7bCXVgQ8D6eXuxAtB58L5F2lWSKN04Lkb/rQG+AyS2eV2; AWSALBCORS=rBVyQQc2Faw0PXCJBAizFC6UJjiCFXJe5eEsab2MeCOUigIiGmxRMb2fSBqyupNxB0G0IO0jy5BLaP+7bCXVgQ8D6eXuxAtB58L5F2lWSKN04Lkb/rQG+AyS2eV2"
    response = MyRequest(cookie, new_film.link)
    TITLE = ''
    SEASON = ''
    STATUS = ''
    STUDIO = ''
    GENRE = ''
    ARENA = ''
    MODIFIED_ON = ''
    soup = BeautifulSoup(response, 'html.parser')
    TITLE = soup.find('div', {'class': 'new-header-wrap-2'}).find('h1').text.strip()
    data = soup.find('table', {'class': 'p18table1'}).find('tbody').find('tr').find_all('td')
    _NETWORK = ''
    try:
        STUDIO = ','.join([_.text.strip() for _ in data[0].find_all('a')])
        GENRE = ','.join([_.text.strip() for _ in data[1].find_all('a')])
        ARENA = ','.join([_.text.strip() for _ in data[2].find_all('a')])
        MODIFIED_ON = data[3].text.strip()
    except:
        STUDIO = ''
        GENRE = ''
        ARENA = ''
        MODIFIED_ON = ''
    try:
        SEASON = soup.find('div', {'class': 'prd-detailsleft'}).find(lambda tag: 'SEASON' in tag.get_text()).find('span').text.strip()
    except:
        SEASON = ''
    try:
        STATUS = soup.find('div', {'class': 'prd-detailsleft'}).find(lambda tag: 'STATUS' in tag.get_text()).find('span').text.strip()
    except:
        STATUS = ''
    data_cells = soup.find_all('div', {'class': 'p18rsec'})
    NETWORKS = []
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
            response = MyRequest(cookie, link)
            soup = BeautifulSoup(response, 'html.parser')
            COMPANY = soup.find('div', {'class': 'new-header-wrap-2'}).find('h1').text.strip()
            _NETWORK += COMPANY + ' | ' + NETWORK[1] + ' | ' + NETWORK[2]

            if index == 0:
                if NETWORK[3][0] >= '0' and NETWORK[3][0] <= '9':
                    _NETWORK += ' | ' + NETWORK[3]
                else:
                    _NETWORK += '.'
        except:
            continue
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
    return 'Checked and updated films'