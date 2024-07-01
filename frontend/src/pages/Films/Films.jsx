import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Pagination, Spin, Button, Modal } from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";

import moment from "moment";

import axios from "../../utils/axios";

const MultiLineText = (text) => {
  const textArray = text.split(",");

  return (
    <div>
      {textArray.map((line, index) => (
        <p key={index} className="mb-1">
          {line.trim()}
        </p>
      ))}
    </div>
  );
};

const columns = [
  {
    title: "TITLE",
    dataIndex: "title",
    key: "title",
    render: (_, record) => (
      <Link to={`/films/${record.id}`} className="text-blue-600">
        {record.title}
      </Link>
    ),
  },
  {
    title: "STUDIO",
    dataIndex: "studio",
    key: "studio",
    render: (text) => MultiLineText(text),
  },
  {
    title: "GENRE",
    dataIndex: "genre",
    key: "genre",
    render: (text) => MultiLineText(text),
  },
  {
    title: "ARENA",
    dataIndex: "arena",
    key: "arena",
    render: (text) => MultiLineText(text),
  },
  {
    title: "MODIFIED AT",
    dataIndex: "modified_at",
    key: "modified_at",
    render: (text) => (text === null ? "" : moment(text).format("MM-DD-YYYY")),
  },
  {
    title: "SEASON",
    dataIndex: "season",
    key: "season",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Link",
    dataIndex: "link",
    key: "link",
    render: (text) => (
      <a href={text} target="_blank" className="text-blue-600" rel="noreferrer">
        {text}
      </a>
    ),
  },
];

export default function Films() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [step, setStep] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `films/?limit=${pageSize}&offset=${(page - 1) * pageSize}`
      );
      setFilms(response.data.results);
      setTotal(response.data.count);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      axios
        .get(`films/need_scrape`)
        .then((res) => {
          setFilms(res.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      fetchData();
    }
  }, [isModalOpen, fetchData]);

  useEffect(() => {}, [error]);

  useEffect(() => {
    if (isScraping) {
      setStep(0);
      const handleScraping = async () => {
        for (let id = 0; id < films.length; id++) {
          await axios.post(`films/scrape/${films[id].id}`);
          setStep((prev) => prev + 1);
        }
      };
      handleScraping();
    } else {
      setStep(0);
    }
  }, [isScraping, films]);

  console.log(isScraping);

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <>
          <Button
            type="primary"
            ghost
            className="mb-3"
            onClick={() => setIsModalOpen(true)}
          >
            Scrape Data
          </Button>
          <Table
            loading={loading}
            columns={columns}
            dataSource={films}
            rowKey="id"
            pagination={false}
          />
          <div className="w-full flex items-cener justify-center my-5">
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
        </>
      )}
      <Modal
        title="Scrape Data"
        open={isModalOpen}
        loading={loading}
        footer={
          <Button
            type="text"
            onClick={() => {
              setIsModalOpen(false);
              setIsScraping(false);
            }}
          >
            Cancel
          </Button>
        }
        styles={{
          mask: {
            backdropFilter: "blur(10px)",
          },
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setIsScraping(false);
        }}
      >
        <div>
          {films.length === 0
            ? "There is no data to scrape."
            : `There are ${films.length} data to scrape.`}
        </div>
        <div className="mt-5">
          {films.length > 0 &&
            (isScraping ? (
              <>
                <div className="flex items-center justify-center w-full">
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
                <div className="flex items-center justify-center w-full mt-2">
                  {step} / {films.length}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<RightOutlined />}
                  onlyIconSize={72}
                  size="large"
                  onClick={() => setIsScraping(true)}
                  className="flex items-center justify-center w-full"
                />
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
}
