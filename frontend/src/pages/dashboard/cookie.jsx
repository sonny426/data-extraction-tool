import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Switch,
  Textarea,
} from "@material-tailwind/react";
import moment from "moment";
import axiosInstance from "@/utils/axios";
import { notification } from "antd";

export function Cookie() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("cookies/latest");
      setData(response.data.cookie);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("cookies/", { "cookie": data });
      setData(response.data.cookie);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div className="mt-12 mb-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Cookie
          </Typography>
        </CardHeader>
        <CardBody className="px-5 pt-0 pb-2">
          <Textarea label="Cookie" value={data} onChange={e => setData(e.target.value)} variant="standard" rows={20} />
          <div className="flex justify-center">
            <Button color="blue" onClick={handleSave}>Save</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Cookie;
