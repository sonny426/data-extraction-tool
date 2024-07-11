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

export function Extract() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("films/need_scrape");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  console.log(data.length, 2742 + 1641)

  return (
    <div className="mt-12 mb-8 grid gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Data Extraction
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">

        </CardBody>
      </Card>
    </div>
  );
}

export default Extract;
