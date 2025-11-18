import React from 'react'

interface Props {
    status: "positive" | "neutral" | "negative";
    message: string;
}

export default function Status(props: Props) {
    const getStatusClasses = (status: Props["status"]) => {
        switch (status) {
            case "positive":
                return "text-green-500 border-green-500 bg-green-50";
            case "neutral":
                return "text-yellow-500 border-yellow-500 bg-yellow-50";
            case "negative":
                return "text-red-500 border-red-500 bg-red-50";
            default:
                return "text-gray-500 border-gray-500 bg-gray-50";
        }
    }
    
    return (
        <div className={`inline-block border-1.5 px-3 py-1.5 rounded-lg font-medium ${getStatusClasses(props.status)}`}>
            {props.message}
        </div>
    )
}