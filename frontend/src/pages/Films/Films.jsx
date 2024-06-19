import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Space, Upload, Table } from "antd";
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
    render: (text) => moment(text).format("MM-DD-YYYY"),
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("films");
        setFilms(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [error]);

  return (
    <div className="container mx-auto px-4">
      <div className="text-right mb-3">
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload PDF</Button>
        </Upload>
      </div>
      <Table loading={loading} columns={columns} dataSource={films} />
    </div>
  );
}
