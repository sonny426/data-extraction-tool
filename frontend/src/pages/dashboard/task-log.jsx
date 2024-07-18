import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
} from "@material-tailwind/react";
import axiosInstance from "@/utils/axios";
import { Pagination } from "antd";
import moment from "moment";

export function TaskLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [histories, setHistories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`task-logs/?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
      setHistories(response.data.results);
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

  useEffect(() => {
    if (error) {
      notification["error"]({
        message: "Error",
        description: JSON.stringify(error),
        showProgress: true,
        pauseOnHover: true,
      });
    }
  }, [error]);

  return (
    <div className="mt-12 mb-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Scraping History
          </Typography>
        </CardHeader>
        <CardBody className="px-58 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "scrape link", "status", "result", "started at"].map((el) => (
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
                Array.from({ length: 5 }).map((_, index) => (
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
                histories.map((history, key) => (
                  <tr key={history.id}>
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
                        <a href={history.scrape_link} target="_blank" className="text-blue-600" rel="noreferrer">
                          Link
                        </a>
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {history.status === "STARTED" ? <Chip color="cyan" value="STARTED" /> : history.status === "FAILURE" ? <Chip color="red" value="FAILURE" /> : history.status === "SUCCESS" ? <Chip color="green" value="SUCCESS" /> : <Chip color="purple" value={history.status} />}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {history.result}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {moment(history.created_at).format("MM-DD-YYYY hh:mm:ss")}
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

export default TaskLog;
