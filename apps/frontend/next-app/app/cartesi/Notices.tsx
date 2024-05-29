"use client"

import React, {useEffect} from "react";
import { useNotices } from "./hooks/useNotices";


export const Notices: React.FC = () => {
    const {loading, error, data, notices, refetch } = useNotices()

    useEffect(() => {
        refetch({ requestPolicy: 'network-only' });
    }, [refetch]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-slate-400">Oh no... {error.message}</p>;

    if (!data || !data.notices) return <p className="text-slate-400">No Notices</p>;
  
    return (
        <div>
            <button className="text-slate-400 mb-4" onClick={() => refetch({ requestPolicy: 'network-only' })}>
                Reload 🔃
            </button>
            <table className="text-slate-400 border">
                <thead>
                    <tr className="border">
                        <th className="border p-2">Input Index</th>
                        <th className="border p-2">Notice Index</th>
                        {/* <th>Input Payload</th> */}
                        <th className="border p-2">Payload</th>
                    </tr>
                </thead>
                <tbody>
                    {notices && notices.length === 0 && (
                        <tr>
                            <td className="p-4" colSpan={4}>no notices</td>
                        </tr>
                    )}
                    {notices && notices.map((n: any) => (
                        <tr key={`${n.input.index}-${n.index}`}>
                            <td>{n.input.index}</td>
                            <td>{n.index}</td>
                            {/* <td>{n.input.payload}</td> */}
                            <td>{n.payload}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};
