import React from 'react'
import PropTypes from 'prop-types'
import {config} from 'aws-cognito-redux-saga'

class Auth extends React.Component{
    static propTypes = {
        getUser: PropTypes.func
    }

    componentWillMount(){
        config.config.set({
            region: 'us-east-1',
            UserPoolId: 'us-east-1_mCar1uAO9',
            ClientId: '1a6b743vqhvdhhoui10h27ig2d',
        })
        this.props.getUser()
    }
    render(){
        return null
    }
    
}

export default Auth