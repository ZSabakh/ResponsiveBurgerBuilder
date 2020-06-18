import React, {Component} from 'react';
import classes from './Modal.css';
import Auxilary from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.show !== this.props.show || nextProps.children !== this.props.children) {
            return true;
        }
        else{
            return false;
        }
    }

    componentWillUpdate () {
        console.log('[Modal] Will update');
    }

    render() {
        return (
            <Auxilary>
            <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
            <div 
            
                style={{
                    transform: this.props.show ? 'translateY(0)': 'translateY(-100vh)',
                    opacity: this.props.show ? '1': '0'
                }}
                className={classes.Modal}>
                {this.props.children}
        
            </div>
            </Auxilary>
        )
    }
}

export default Modal;