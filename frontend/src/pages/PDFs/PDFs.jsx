import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Input, notification, Spin } from "antd";

import axios from "../../utils/axios";

const columns = [
  {
    title: "TITLE",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Link",
    dataIndex: "pdf_file",
    key: "pdf_file",
    render: (text) => (
      <a href={text} target="_blank" className="text-blue-600" rel="noreferrer">
        {text}
      </a>
    ),
  },
  {
    title: "Films",
    key: "films",
    render: (_, record) => record.films.length,
  },
];

export default function Films() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("pdfs");
      setPdfs(response.data.results);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPDF = async (e) => {
    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("title", title);
    setLoading(true);
    try {
      await axios.post("pdfs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      notification["success"]({
        message: "Success",
        description: "File Uploaded Successfully.",
        showProgress: true,
        pauseOnHover: true,
      });
      setIsModalOpen(false);
      setTitle(null);
      setFile(null);
      fetchData();
    } catch (error) {
      setLoading(false);
      setError(error.response.data);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-right mb-3">
        <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
          Upload PDF
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={pdfs}
        pagination={false}
        rowKey="title"
      />
      <Modal
        title="Upload PDF"
        open={isModalOpen}
        onOk={handleSubmitPDF}
        okText="Upload"
        onCancel={() => {
          setIsModalOpen(false);
          setTitle(null);
          setFile(null);
        }}
      >
        {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        ) : (
          <div className="px-2 py-4">
            <div className="mb-3">
              <label className="text-base">Title: </label>
              <Input
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div className="mb-3">
              <label className="text-base">File: </label>
              <input
                className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onChange={handleFileChange}
                type="file"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
