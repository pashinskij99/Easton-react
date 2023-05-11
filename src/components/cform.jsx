import React from 'react';

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Textarea,
    Button,
} from "@chakra-ui/react"

import{ init } from 'emailjs-com';
init("user_B8qeKNMRzOmF4b8ozdPNZ");

export default class extends React.Component {
  constructor(props) {
	super(props);
	this.state = { 
	    feedback: '', name: '', email: '',
	    eer: false, eerm: '',
	    ner: false, nerm: '',
	    mer: false, merm: '',
	    sent: false, sending: false,
	};
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
	return (
        <>
	    <div className="flex flex-col content-center w-full max-w-4xl mt-8 ml-3 mr-3 justify-items-center">
        	    <p
		className="mb-10 ml-2 mr-2 text-3xl font-extrabold text-center text-gray-700"
	    > 
		Shoot us a Message! <br></br>
		<span className="text-xl font-normal text-green-500"> We'd love to hear from you. </span>
	    </p>
		<div className="flex flex-col md:flex-row md:space-x-4">
		    <FormControl id="email" className="p-4 mb-4 border border-gray-400 rounded-xl"
			isInvalid={this.state.eer}
		    >
			<FormLabel>Email address</FormLabel>
			<Input type="email"
			    onChange={(e) => { this.setState({email: e.target.value}); console.log(this.state.email)}} 
			    value={this.state.email}
			/>
			<FormHelperText>We'll never share your email.</FormHelperText>
			<FormErrorMessage>{this.state.eerm}</FormErrorMessage>
		    </FormControl>
		    <FormControl id="name" className="p-4 mb-4 border border-gray-400 rounded-xl"
			isInvalid={this.state.ner}
		    >
			<FormLabel>Name</FormLabel>
			<Input type="name"
			    onChange={(e) => { this.setState({name: e.target.value}) } }
			    value={this.state.name}
			/>
			<FormHelperText>What's your name?</FormHelperText>
			<FormErrorMessage>{this.state.nerm}</FormErrorMessage>
		    </FormControl>
		</div>
		<FormControl id="comments" className="p-4 border border-gray-400 rounded-xl"
			isInvalid={this.state.mer}
		>
		    <FormLabel>Comments</FormLabel>
		    <Textarea placeholder="What do you want to ask us?"
			className=""
			onChange={(e) => { this.setState({feedback: e.target.value}) } }
			value={this.state.feedback}
		    />
		    <FormHelperText>Your message!</FormHelperText>
			<FormErrorMessage>{this.state.merm}</FormErrorMessage>
		</FormControl>

		<Button
		    mt={4}
		    colorScheme="green"
		    //isloading
		    //loadingText="Sending..."
		    //isLoading={props.isSubmitting}
		    isDisabled={this.state.sent}
		    type="submit"
		    onClick={this.handleSubmit}
		>
		    {this.state.sent? "Sent!" : "Send!"}
		</Button>
	    </div></>
	)
  }
    validateEmail(e) {
	let re = /\S+@\S+\.\S+/;
	return re.test(e);
    }

    handleChange(event) {
	this.setState({feedback: event.target.value})
    }

    handleSubmit (event) {
	let err = false
	const templateId = 'template_djlsgya';
	if (!this.validateEmail(this.state.email)) {
	    this.setState({eer: true, eerm: "Invalid email"})
	    err = true
	} else { this.setState({eer: false, eerm: ""}) }

	if (this.state.name === "") {
	    this.setState({ner: true, nerm: "Nothing here?"})
	    err = true
	} else { this.setState({ner: false, nerm: ""}) }


	if (this.state.feedback === "") {
	    this.setState({mer: true, merm: "Nothing to tell us?"})
	    err = true
	} else { this.setState({mer: false, merm: ""}) }

	if (!err && !this.state.sent) {
	    console.log("setting")
	    this.setState({sending: true, sent: true})
	    this.sendFeedback(templateId,
		{message: this.state.feedback, from_name: this.state.name, reply_to: this.state.email}
	    )
	}
    }

    sendFeedback (templateId, variables) {
	window.emailjs.send(
	    'THISISANID', templateId,
	    variables
	).then(res => {
	    console.log('sent!')
	})
	    .catch(err => console.error('err', err))
    }

}
