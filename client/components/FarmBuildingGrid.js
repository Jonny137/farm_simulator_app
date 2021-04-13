import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
} from '@material-ui/core';

import { BASE_URL } from '../utils/constants';
import { addFarmBuilding } from '../redux/farm-building/actions';
import FarmBuildingCard from './FarmBuildingCard';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        display: 'flex',
        width: '100%',
        margin: theme.spacing(0, 'auto'),
    },
    cardContainer: {
        flex: 1,
    },
    cards: {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
        rowGap: `${theme.spacing(4)}px`,
        columnGap: theme.spacing(6),
        justifyItems: 'center',
        margin: theme.spacing(4),
    },
    addButton: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

export default function FarmBuildingGrid() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const farmBuildings = useSelector(state => state);

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [buildingName, setBuildingName] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [addError, setOpenAddError] = useState(false);

    const handleClose = reason => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAddError(false);
    };

    const handleAddFarmBuilding = async () => {
        try {
            const data = {
                name: buildingName,
                unitType: buildingType,
            }

            const newFarmBuilding = await axios.post(`${BASE_URL}/farm-buildings`, data);

            dispatch(addFarmBuilding(newFarmBuilding.data));
            setBuildingName('');
            setBuildingType('');
            setAddDialogOpen(false);
        } catch (error) {
            setOpenAddError(true);
        }
    };

    return (
        <>
            <div className={classes.gridContainer}>
                <div className={classes.cardContainer}>
                    <div className={classes.cards}>
                        {farmBuildings.map((value, key) => (
                            <FarmBuildingCard key={key} building={value} />
                        ))}
                    </div>
                </div>
            </div>
            <Tooltip title="Add Farm Building">
                <Fab
                    color="primary"
                    className={classes.addButton}
                    onClick={() => setAddDialogOpen(true)}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Add Farm Building
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        required
                        defaultValue={buildingName}
                        onChange={(e) => setBuildingName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="type"
                        label="Type"
                        type="text"
                        fullWidth
                        required
                        defaultValue={buildingType}
                        onChange={(e) => setBuildingType(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddFarmBuilding}
                        color="primary"
                        disabled={buildingType === '' || buildingName === ''}
                        variant="outlined"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={addError} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error'>
                    Failed to add farm building.
                </Alert>
            </Snackbar>
        </>
    );
}
