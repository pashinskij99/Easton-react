import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Link,
} from "@chakra-ui/react"
import "./dashboard.css"

function CustomerDashboard(props) {

    useEffect(() => {
	document.body.style.backgroundColor = "#F0F3F4"
    })

    return (
	<div className="mt-10">
	    <p className="mb-10 ml-0 text-4xl font-extrabold text-center text-gray-700 md:ml-12 md:text-left">
		Dashboard <br></br>
		<span className="text-xl font-normal text-blue-400"> Here's what's happening. </span>
	    </p>
	    <div className="flex flex-row flex-wrap">
		<div className="flex flex-col flex-wrap cat-wrapper">
		    <div className="flex flex-row flex-wrap justify-center md:justify-start md:ml-12" >
			<div className="flex flex-col flex-wrap md:flex-row md:justify-start bubble-cat">
			    <div className="cat-name">
				<p className="p-3 mb-5 border-0 border-gray-400 rounded-xl">Dates</p>
				<div className="p-6 mt-0 text-xl text-white bg-green-300 rounded-lg shadow-md md:mt-5 single"> Not Late </div>
			    </div>
			    <div className="flex flex-col">
				<div className="bubble lb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Due Date
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-blue-500 ">
					05-11-2022
				    </div>
				</div>
				<div className="bubble lb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Pay Date
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-blue-500 ">
					04-08-2022
				    </div>
				</div>
			    </div>
			</div>

			<div className="flex flex-col flex-wrap ml-3 md:ml-0 lg:ml-5 md:flex-row md:justify-start bubble-cat">
			    <div className="cat-name">
				<p className="p-3 mt-5 mb-0 border-0 border-gray-400 rounded-xl">Pay</p>
				<div className="mt-10 mb-0 ml-4 md:mb-5 bubble mbb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Amount Paid
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-green-400 ">
					$50
				    </div>
				</div>
			    </div>
			    <div className="flex flex-col">
				<div className="bubble mbb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Amount Due
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-green-400 ">
					$500
				    </div>
				</div>
				<div className="bubble mbb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Amount Past Due
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-green-400 ">
					$0
				    </div>
				</div>
			    </div>
			</div>

			<div className="flex flex-col flex-wrap ml-3 mr-5 md:ml-0 lg:ml-5 md:flex-row md:justify-start bubble-cat">
			    <div className="s-cat-name">
				<p className="p-1 border-0 border-gray-400 rounded-xl">Balance</p>
			    </div>
			    <div className="flex flex-col">
				<div className="bubble mbb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Current Balance
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-green-400 ">
					$252
				    </div>
				</div>
				<div className="bubble mbb">
				    <div className="-mt-6 text-sm font-bold text-gray-400 border-0 border-red-600">
					Initial Balance
				    </div>
				    <div className="mt-1 text-3xl font-semibold text-green-400 ">
					$670
				    </div>
				</div>
			    </div>
			</div>

			<div className="flex flex-col pb-4 ml-3 mr-5 md:ml-0 md:flex-row md:justify-start bubble-cat">
			    <div className="flex flex-col">
				<div className="mt-4 mb-7 cat-name">
				    <p className="p-1 border-0 border-gray-400 rounded-xl">Account</p>
				</div>
				<div className="h-20 ml-5 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					Name
				    </div>
				    <div className="mt-0 text-xl font-bold text-purple-300 ">
					Wallen Man
				    </div>
				</div>
				<div className="h-20 ml-5 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					Last Modification
				    </div>
				    <div className="mt-0 text-xl font-bold text-purple-300 ">
					04-08-2022
				    </div>
				</div>
			    </div>
			    <div className="flex flex-col ">
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					CID
				    </div>
				    <div className="mt-0 text-xl font-semibold text-purple-300 ">
					271828
				    </div>
				</div>
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					LID
				    </div>
				    <div className="mt-0 text-xl font-semibold text-purple-300 ">
					16180339
				    </div>
				</div>
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					CTR
				    </div>
				    <div className="mt-0 text-xl font-semibold text-purple-300 ">
					314159265
				    </div>
				</div>
			    </div>
			</div>

			<div className="flex flex-col pb-4 ml-3 mr-5 md:ml-0 md:flex-row md:justify-start bubble-cat">
			    <div className="flex flex-col">
				<div className="mt-4 mb-7 cat-name">
				    <p className="p-1 border-0 border-gray-400 rounded-xl">Locational</p>
				</div>
				<div className="h-20 ml-5 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					Address One
				    </div>
				    <div className="mt-0 font-bold text-red-300 text-md ">
					1600 PA Ave.
				    </div>
				</div>
				<div className="h-20 ml-5 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					Address Two
				    </div>
				    <div className="mt-0 font-bold text-red-300 text-md ">
					1601 PA Ave.
				    </div>
				</div>
			    </div>
			    <div className="flex flex-col ">
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					City
				    </div>
				    <div className="mt-0 text-xl font-semibold text-red-300 ">
					Tennessee
				    </div>
				</div>
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					State
				    </div>
				    <div className="mt-0 text-xl font-semibold text-red-300 ">
					Washington
				    </div>
				</div>
				<div className="h-20 s-bubble mbb">
				    <div className="-mt-0 text-sm font-bold text-gray-400 border-0 border-red-600">
					Postal Code
				    </div>
				    <div className="mt-0 text-xl font-semibold text-red-300 ">
					37188
				    </div>
				</div>
			    </div>
			</div>

		    </div>
		{/*
		    <div className="mr-5 md:ml-12">
			<div className="h-96 bubble-cat">
			</div>
		    </div>
		*/}
		</div>
		{/*
		<div className="ml-5 w-96 bubble-cat extra">
		</div>
		*/}
	    </div>
	</div>
    );
}

export default CustomerDashboard;

