import React from "react";
import { ethers } from "ethers";
import { useInspectCall } from "../cartesi/hooks/useInspectCall";


export const Inspect: React.FC = () => {
    const { setInspectData, inspectData, setHexData,hexData,postData, 
        setPostData,metadata, reports, inspectCall} = useInspectCall()

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inspectData}
                    onChange={(e) => setInspectData(e.target.value)}
                />
                <input type="checkbox" checked={hexData} onChange={(e) => setHexData(!hexData)}/><span>Raw Hex </span>
                <input type="checkbox" checked={postData} onChange={(e) => setPostData(!postData)}/><span>POST </span>
                <button onClick={() => inspectCall(inspectData)}>
                    Send
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Active Epoch Index</th>
                        <th>Curr Input Index</th>
                        <th>Status</th>
                        <th>Exception Payload</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{metadata.metadata ? metadata.metadata.active_epoch_index : ""}</td>
                        <td>{metadata.metadata ? metadata.metadata.current_input_index : ""}</td>
                        <td>{metadata.status}</td>
                        <td>{metadata.exception_payload ? ethers.toUtf8String(metadata.exception_payload): ""}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    {reports?.length === 0 && (
                        <tr>
                            <td colSpan={4}>no reports</td>
                        </tr>
                    )}
                    {reports?.map((n: any) => (
                        <tr key={`${n.payload}`}>
                            <td>{ethers.toUtf8String(n.payload)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
