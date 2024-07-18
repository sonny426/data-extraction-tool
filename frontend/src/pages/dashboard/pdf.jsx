import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Switch,
} from "@material-tailwind/react";
import moment from "moment";
import axiosInstance from "@/utils/axios";
import { notification } from "antd";

export function PDF() {
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [recollect, setRecollect] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("pdfs");
      setPdfs(response.data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPDF = async (e) => {
    if (title === null || title === '') {
      setError({
        title: 'Please input title.',
      });
      return;
    }
    if (file === null) {
      setError({
        file: 'Please select correct file.',
      });
      return;
    }
    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("title", title);
    formData.append("recollect", recollect);
    setLoading(true);
    try {
      const newPDF = await axiosInstance.post("pdfs/", formData, {
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
      setTitle('');
      setFile(null);
      setPdfs([
        newPDF.data,
        ...pdfs
      ])
    } catch (error) {
      setLoading(false);
      console.log(error)
      setError(error.response.data);
    }
  };

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
    <div className="mt-12 mb-8 grid grid-cols-12 gap-12">
      <Card className="col-span-8">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            PDF Storage
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "title", "Films", "Source", "Uploaded At"].map((el) => (
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
                      Array.from({ length: 5 }).map((_, index2) => (
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
                pdfs.map((pdf, key) => (
                  <tr key={pdf.id}>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {key + 1}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        className="font-semibold"
                      >
                        {pdf.title}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {pdf.films}
                      </Typography>

                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        <a href={pdf.pdf_file} target="_blank" className="text-blue-600" rel="noreferrer">
                          Link
                        </a>
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new moment(pdf.created_at).format('MM-DD-YYYY hh:mm:ss')}
                      </Typography>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Card className="col-span-4">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Upload PDF
          </Typography>
        </CardHeader>
        <CardBody className="px-4 pt-0 pb-2">
          <Input
            label="Title"
            placeholder="Title"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            error={error?.title?.length > 0}
          />
          <Input
            variant="static"
            onChange={handleFileChange}
            type="file"
            className="mt-2"
            value={file ? file.filename : ''}
            error={error?.file?.length > 0}
          />
          {/* <Switch
            label={
              <div className="mt-4">
                <Typography color="blue-gray" className="font-medium">
                  Recollect data
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {
                    recollect ?
                      "This will gather data again even if already contains data." :
                      "This will skip recollecting the data and it will be updated soon."
                  }
                </Typography>
              </div>
            }
            color="green"
            containerProps={{
              className: "mt-5",
            }}
            onChange={e => setRecollect(e.target.checked)}
            value={recollect}
          /> */}
          <div className="flex justify-center mt-6">
            <Button variant="gradient" color="cyan" onClick={() => handleSubmitPDF(true)} className="mx-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              Upload PDF
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PDF;
