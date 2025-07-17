import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

const APITest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log("Testing connection to:", axiosInstance.defaults.baseURL);
      const response = await axiosInstance.get("/health");
      setResult(`✅ Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error("Connection test failed:", error);
      setResult(
        `❌ Error: ${error.message}\nStatus: ${
          error.response?.status
        }\nData: ${JSON.stringify(error.response?.data, null, 2)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const testData = { email: "test@test.com", password: "test123" };
      console.log("Testing login with:", testData);
      const response = await axiosInstance.post("/login", testData);
      setResult(
        `✅ Login Test Success: ${JSON.stringify(response.data, null, 2)}`
      );
    } catch (error) {
      console.error("Login test failed:", error);
      setResult(
        `❌ Login Error: ${error.message}\nStatus: ${
          error.response?.status
        }\nData: ${JSON.stringify(error.response?.data, null, 2)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <p className="mb-4">Backend URL: {axiosInstance.defaults.baseURL}</p>

      <div className="space-x-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Testing..." : "Test Health Check"}
        </button>

        <button
          onClick={testLogin}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? "Testing..." : "Test Login"}
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
        {result || "Click a button to test..."}
      </pre>
    </div>
  );
};

export default APITest;
