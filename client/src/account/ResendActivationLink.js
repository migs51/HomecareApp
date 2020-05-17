import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class ResendActivationLink extends Component {
    state = {
        email: ''
    }

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleSubmitClick = () => {
        //submits email to the server
        const url = '/api/resend-activation-link';
        
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({
                email: this.state.email
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(err => {throw err})
            }
            return response.json();
        }).then((results) => {
            //when created, route the user to user dashboard
            console.log('results', results);

        })
        .catch((error) => {
            //eventually display error to user on UI
            console.log('error', error);
        })
    }

    render() {
        return (
            <div className = "container">
                <h2>Resend Activation Link</h2>
                <div>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            onChange={this.handleEmailChange}
                            value={this.state.email}
                            />
                            <Form.Text className="text-muted">
                            This account should already exist in our database.
                            </Form.Text>
                        </Form.Group>

                        <Button 
                            variant="primary"
                            type="button"
                            onClick={this.handleSubmitClick}
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default ResendActivationLink;