import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import axiosInstance from "@/utils/axios";
import { Pagination } from "antd";
import moment from "moment";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";

export function Films() {
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [maxNetworks, setMaxNetworks] = useState(1);
  const [headers, setHeaders] = useState([]);

  const downloadCSV = () => {
    // Prepare CSV content
    const csvContent = "data:text/csv;charset=utf-8," + films.map(row => {
      const fieldsToRemove = ['id', 'need_scrape', 'network', 'networks', 'created_at', 'updated_at', 'link'];
      Array.from({ length: maxNetworks }).forEach((_, index) => {
        row[`networks${index}`] = index < row.networks.length ? row.networks[index] : ''
      })
      row = Object.fromEntries(
        Object.entries(row).filter(([key]) => !fieldsToRemove.includes(key))
      );
      return "\"" + Object.values(row).join('\",\"') + "\""
    }).join('\n');

    // Create a link element, set its href attribute to the CSV content
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "search_results.csv");

    // Append the link to the body
    document.body.appendChild(link);

    // Click the link programmatically to trigger the download
    link.click();

    // Clean up: remove the link from the DOM
    document.body.removeChild(link);
  };

  const updateNetwork = (data) => {
    let ret = []
    let maxLength = 0;
    data.forEach(film => {
      const pattern = /\((i{1,3}|iv|v)\)\.\s*/;
      const result = film.network.split(pattern).filter(item => item.trim() !== '' && !/^(i{1,3}|iv|v)$/.test(item.trim())).map(item => item.trim());
      ret.push({
        ...film,
        networks: result
      });
      maxLength = Math.max(maxLength, result.length)
    });
    return { data: ret, maxNetwork: maxLength };
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    try {
      const source = urlParams.get('source');
      if (source) {
        const response = await axiosInstance.get(`films/?limit=${pageSize}&offset=${(page - 1) * pageSize}&source=${source}`);
        const { data, maxNetwork } = updateNetwork(response.data.results);
        setMaxNetworks(maxNetwork);
        setFilms(data);
        setTotal(response.data.count);
        setLoading(false);
        let headers_ = ["no", "title", "studio", "genre", "arena", "modified at", "season", "status"];
        for (let i = 1; i <= maxNetwork; i++) {
          headers_.push(`network${i}`);
        }
        headers_.push("link");
        setHeaders(headers_)
      } else {
        const response = await axiosInstance.get(`films/?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
        const { data, maxNetwork } = updateNetwork(response.data.results);
        setMaxNetworks(maxNetwork);
        setFilms(data);
        setTotal(response.data.count);
        setLoading(false);
        let headers_ = ["no", "title", "studio", "genre", "arena", "modified at", "season", "status"];
        for (let i = 1; i <= maxNetwork; i++) {
          headers_.push(`network${i}`);
        }
        headers_.push("link");
        setHeaders(headers_)
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mt-12 mb-8 grid gap-12">
      <div className="flex justify-center">
        <Button variant="gradient" color="cyan" onClick={downloadCSV} className="mx-4 flex items-center gap-3">
          <CloudArrowDownIcon className="w-5 h-5 text-inherit" />
          Download
        </Button>
      </div>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Films
          </Typography>
        </CardHeader>
        <CardBody className="px-5 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {headers.map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    {
                      Array.from({ length: 9 }).map((_, index2) => (
                        <td key={'td' + index2}>
                          <Typography
                            as="div"
                            variant="h1"
                            className="mx-5 my-3 h-4 w-100 rounded-full bg-gray-300"
                          >
                            &nbsp;
                          </Typography>
                        </td>
                      ))
                    }
                  </tr>
                ))
              ) : (
                films.map((film, key) => (
                  <tr key={film.id}>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {pageSize * (page - 1) + key + 1}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        className="text-xs font-semibold text-blue-gray-600"
                      >
                        {film.title}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {film.studio}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {film.genre}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {film.arena}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {moment(film.modified_at).format("MM-DD-YYYY")}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {film.season}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {film.status}
                      </Typography>
                    </td>
                    {
                      Array.from({ length: maxNetworks }).map((network, index) => (
                        <td className="py-3 px-5 border-b border-blue-gray-50" key={`${film.id}${index}`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {index < film.networks.length ? film.networks[index] : ''}
                          </Typography>
                        </td>
                      ))
                    }
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        <a href={film.link} target="_blank" className="text-blue-600" rel="noreferrer">
                          Link
                        </a>
                      </Typography>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="my-3 w-full flex justify-center text-xs font-semibold text-blue-gray-600">
            <Pagination
              total={total}
              current={page}
              pageSize={pageSize}
              pageSizeOptions={[
                100, 200, 500, 1000, 5000, 10000, 100000, 1000000,
              ]}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              onChange={(page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Films;
