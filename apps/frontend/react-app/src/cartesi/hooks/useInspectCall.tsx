import { ethers } from 'ethers';
import configFile from '../config.json';
import { toHex } from 'viem';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { errorAlert, successAlert } from '../../utils/customAlert';

const config: any = configFile;

interface Report {
  payload: string;
}

export const useInspectCall = () => {
  const { chain } = useAccount();
  const [inspectData, setInspectData] = useState<string>("");
  const [reports, setReports] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>({});
  const [hexData, setHexData] = useState<boolean>(false);
  const [postData, setPostData] = useState<boolean>(false);
  const [decodedReports, setDecodedReports] = useState<any>({});

  const inspectCall = async (payload: string) => {
    try {
      if (hexData) {
        const uint8array = ethers.getBytes(payload);
        payload = new TextDecoder().decode(uint8array);
      }

      if (!chain) {
        return;
      }

      let apiURL = "";

      if (config[toHex(chain.id)]?.inspectAPIURL) {
        apiURL = `${config[toHex(chain.id)].inspectAPIURL}/inspect`;
      } else {
        console.error(`No inspect interface defined for chain ${toHex(chain.id)}`);
        return;
      }

      let response;
      if (postData) {
        const payloadBlob = new TextEncoder().encode(payload);
        response = await fetch(apiURL, { method: 'POST', body: payloadBlob });
      } else {
        response = await fetch(`${apiURL}/${payload}`);
      }

      const data = await response.json();
      setReports(data.reports);
      setMetadata({ metadata: data.metadata, status: data.status, exception_payload: data.exception_payload });

      // Decode payload from each report
      const decode = data.reports.map((report: Report) => {
        return ethers.toUtf8String(report.payload);
      });

      console.log("Decoded Reports:", decode);
      const reportData: any = JSON.parse(decode);
      console.log("Report data: ", reportData);
      setDecodedReports(reportData);
      successAlert(reportData)
    } catch (error: any) {      
      console.error("Error fetching inspect data:", error)
      errorAlert(error)
    }
  };

  return {
    reports,
    metadata,
    setInspectData,
    inspectData,
    setHexData,
    hexData,
    setPostData,
    postData,
    decodedReports,
    inspectCall,
  };
};
