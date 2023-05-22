import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ContractViewer = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [solidityCode, setSolidityCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}`);
      const contractData = response.data.result[0];

      if (contractData.SourceCode) {
        setSolidityCode(contractData.SourceCode);
      } else {
        setSolidityCode('Solidity code not found for the provided contract address.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setSolidityCode('Error occurred while fetching the Solidity code.');
    }

    setIsLoading(false);
    setIsCopied(false);
  };

  const handleCopy = () => {
    setIsCopied(true);
  };

  const openRemixIDE = () => {
    if (contractAddress) {
      window.open(`https://remix.ethereum.org/=${contractAddress}`);
    }
  };

 ;

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter contract address"
          />
          <button type="submit" className="btn btn-primary">
            Fetch Solidity Code
          </button>
        </div>
      </form>
      <div className="mt-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div >
            <MonacoEditor
              language="javascript"
              theme="vs-light"
              value={solidityCode}
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'auto',
                },
              }}
              height="300"
            />
            {solidityCode && (
              <div className="output-actions">
                <CopyToClipboard text={solidityCode} onCopy={handleCopy}>
                  <button className="btn btn-secondary mr-2">
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </CopyToClipboard>
                <button className="btn btn-secondary" onClick={openRemixIDE}>
                  Open Remix IDE
                </button>
               
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractViewer;
