import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxilary from '../Auxilary/Auxilary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount () {
            this.requInterc = axios.interceptors.request.use(requ => {
                this.setState({error:null});
                return requ;
            })

            this.requInterc = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})
            })
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.requInterc);
            axios.interceptors.response.eject(this.requInterc);
        }

        errorCloseHandler = () => {
            this.setState({error: null})
        }

        render() {
            return (
                <Auxilary>
                    <Modal show={this.state.error} modalClosed={this.errorCloseHandler}>
                        {this.state.error ? this.state.error.message : null}
                        
                    </Modal>
                <WrappedComponent {...this.props} />
                </Auxilary>
            );
        }
    }
}

export default withErrorHandler;