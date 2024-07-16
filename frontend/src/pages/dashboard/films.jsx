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

export function Films() {
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`films/?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
      setFilms(response.data.results);
      setTotal(response.data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(films)

  return (
    <div className="mt-12 mb-8 grid gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Films
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "title", "studio", "genre", "arena", "modified at", "season", "status", "link"].map((el) => (
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
                        {film.modified_at}
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
