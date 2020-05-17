import React, { Component } from 'react';
import queryString from 'query-string';

class AccountActivation extends Component {
    state = {
        busy: false
    }
    componentDidMount() {
        //Get token from URL
        const queryStringParams = queryString.parse(this.props.location.search);
        const token = queryStringParams.token
        
        if (!token) {
            this.setState({
                busy: false,
                error: true
                
            })
            return;
           
        }

        this.setState({
            busy: true
        })

        const url = '/api/account-activate';

        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({
                activationToken: token
            })
        }).then((response) => {
            this.setState({
                busy: false
            })
            if (!response.ok) {
                return response.json().then(err => {throw err})
            }
            return response.json();
        }).then((results) => {

            this.setState({
                success: true
            })
            console.log('results', results);
            


        })
        .catch((error) => {
            this.setState({
                error: true,
                busy: false
            })
            //eventually display error to user on UI
            console.log('error', error);
        })
            

    }
    render() {
        return (
            <div>
                {
                    this.state.busy ?
                    <div>Activating Account.....</div>:
                    null
                }
                {
                    this.state.error && <div> An error occurred. Perhaps you requested a new token?</div>   
                }

                {
                    this.state.success && <div>Successfully activated your account. Please proceed to the Login screen to sign in.</div>
                }
                
            </div>
        );
    }
}

export default AccountActivation;