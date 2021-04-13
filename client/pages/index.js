import Head from 'next/head';
import React, { useState } from 'react';
import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import FarmBuildingGrid from '../components/FarmBuildingGrid';
import { BASE_URL } from '../utils/constants';
import { wrapper } from '../redux/store';
import { SET_FARM_BUILDINGS } from '../redux/farm-building/types';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        margin: theme.spacing(3),
        fontWeight: 'bold',
    },
}));

export default function Home({ farmBuildings }) {
    const classes = useStyles();

    const [openSucces, setOpenSuccess] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleClose = (reason, severity) => {
        if (reason === 'clickaway') {
            return;
        }

        switch (severity) {
            case 'error':
                setOpenError(false);
                break;
            case 'success':
                setOpenSuccess(false);
                break;
            case 'warning':
                setOpenWarning(false);
                break;
        }
    };

    return (
        <>
            <Head>
                <title>Farm Simulator</title>
                <link rel="icon" href="/piggy.png" />
            </Head>
            <CssBaseline />
            <Container maxWidth="lg">
                <Typography variant="h3" className={classes.title}>
                    Farm Panel
                </Typography>
                <FarmBuildingGrid buildings={farmBuildings} />
            </Container>
            <Snackbar
                open={openSucces}
                autoHideDuration={3000}
                onClose={(event, reason) => handleClose(reason, 'success')}
            >
                <Alert
                    onClose={(event, reason) => handleClose(reason, 'success')}
                    severity="success"
                >
                    New farm building created.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openWarning}
                autoHideDuration={3000}
                onClose={(event, reason) => handleClose(reason, 'warning')}
            >
                <Alert
                    onClose={(event, reason) => handleClose(reason, 'warning')}
                    severity="warning"
                >
                    There was an error trying to get farm buildings.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openError}
                autoHideDuration={3000}
                onClose={(event, reason) => handleClose(reason, 'error')}
            >
                <Alert
                    onClose={(event, reason) => handleClose(reason, 'error')}
                    severity="error"
                >
                    Failed to create new farm building.
                </Alert>
            </Snackbar>
        </>
    );
}

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
    let farmBuildings = [];
    
    try {
        const response = await axios.get(`${BASE_URL}/farm-buildings`);
        farmBuildings = response.data;
    } catch (error) {
        console.error(error);
    }

    store.dispatch({type: SET_FARM_BUILDINGS, payload: farmBuildings});
}); 
