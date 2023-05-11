import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Link,
} from "@chakra-ui/react"
import './home.css'

function DemoSignin(props) {

    return (
	<div className="flex flex-col items-center content-center justify-center text-center text-gray-800 mt-14">
	    <p className="text-5xl font-black md:text-6xl"> Sign in goes here.</p>
	    <span className="mt-5 text-xl font-medium text-blue-400"> For now,</span>
	    <p className="mb-8 text-lg text-gray-700 mt-14"> Bypass as: </p>
	    <div className="flex flex-col md:flex-row md:space-x-7">
		<Link
		    href={'dashboard-d'}
		    className="w-64 p-3 text-2xl font-black bg-green-400 rounded-lg shadow-2xl cta hover:bg-green-300 pl-14 pr-14 text-gray-50 "
		    _hover={{
			textDecoration: 'none',
		    }}
		>Dealer</Link>
		<Link
		    href={'dashboard-c'}
		    className="w-64 p-3 mt-8 text-2xl font-black bg-green-400 rounded-lg shadow-2xl md:mt-0 cta hover:bg-green-300 pl-14 pr-14 text-gray-50 "
		    _hover={{
			textDecoration: 'none',
		    }}
		>Customer</Link>
	    </div>
	</div>
    );
}

export default DemoSignin;



