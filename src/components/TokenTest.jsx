import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

const TokenTest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testToken = async () => {
    setLoading(true);
    try {
      console.log("Testing token transmission...");

      // Check localStorage token
      const storedToken = localStorage.getItem("auth-token");
      console.log("Stored token:", storedToken ? "Found" : "Not found");

      // Check document cookies
      console.log("Document cookies:", document.cookie);

      // Test API call
      const response = await axiosInstance.get("/message/users");
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error("Token test failed:", error);
      setResult(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Token Test</h3>
      <button
        onClick={testToken}
        disabled={loading}
        className="btn btn-primary mb-4"
      >
        {loading ? "Testing..." : "Test Token"}
      </button>
      <pre className="text-sm bg-base-300 p-4 rounded overflow-auto max-h-96">
        {result || 'Click "Test Token" to check authentication'}
      </pre>
    </div>
  );
};

export default TokenTest;
