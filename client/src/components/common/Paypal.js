import React, {useEffect} from 'react'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { apiCreateOrder } from 'apis';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// This value is from the props in the UI
const style = {"layout":"vertical"};

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency,showSpinner,amount, payload ,setPaymentSuccess}) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate()
    useEffect(() => {
     dispatch({
        type: 'resetOptions',
        value: {
            ...options, currency: currency
        }
     })
    }, [currency, showSpinner])
    const handleSaveOrder = async () => {
        const response = await apiCreateOrder({...payload, status: 'Success'})
        if(response.success) {
            setPaymentSuccess(true)
            setTimeout(() => {
                Swal.fire('Congratulation!','Payment successful','success').then(() => {
                    navigate('/')
                })
            }, 1000)
        }
    }
    return (
        <>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        {amount: {currency_code: currency, value: amount}}
                    ]
                }).then(orderId => orderId)}
                onApprove={(data, actions) => actions.order.capture().then( async(response) =>{
                    if(response.status === 'COMPLETED') {
                        handleSaveOrder()
                    }
                })}
            />
        </>
    );
}

export default function Paypal({amount, payload, setPaymentSuccess}) {
    return (
        <div style={{ maxWidth: "500px", minHeight: "200px", margin: 'auto' }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setPaymentSuccess={setPaymentSuccess} payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}