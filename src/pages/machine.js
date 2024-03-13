import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Router, { useRouter } from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import OdooLib from '../models/odoo';
import SnackbarMessage from '../components/snackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  outlineBtnStyle: {
    minWidth: ['60px', '80px', '100px', '120px', '156px'],
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    textTransform: 'none',
    color: theme.palette.secondary.main,
  },
  btnStyle: {
    minWidth: ['60px', '80px', '100px', '120px', '156px'],
    fontSize: ['10px', '12px', '14px'],
    fontWeight: '500',
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 300,
    justifyContent: 'center',
    marginTop: '100px',
  },
  warning: {
    backgroundColor: '#C01743',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  buttonProgressLoading: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -12,
  },
  wrapper: {
    position: 'relative',
  },
}));

const MachinePage = ({ setTitle }) => {
  const classes = useStyles();
  setTitle('Machine');

  const [msgBox, setMsgBox] = useState({ message: '', variant: 'success' });
  const [load, setLoading] = useState(false);
  const [state, setState] = useState({
    shiftId: '',
    shiftName: '',
    spvId: '',
    spvName: '',
    dieMchId: '',
    dieMchName: '',
    pressMchId: '',
    pressMchName: '',
    ovenMchId: '',
    ovenMchName: '',
    rackingMchId: '',
    rackingMchName: '',
    unrackingMchId: '',
    unrackingMchName: '',
    potongMchId: '',
    potongMchName: '',
    anodizeMchId: '',
    anodizeMchName: '',
    polishMchId: '',
    polishMchName: '',
    brushMchId: '',
    brushMchName: '',
    holeMchId: '',
    holeMchName: '',
    bendingMchId: '',
    bendingMchName: '',
    ulirMchId: '',
    ulirMchName: '',
    etchingMchId: '',
    etchingMchName: '',
    paintingMchId: '',
    paintingMchName: '',
    palletMchId: '',
    palletMchName: '',
    cuttingFabMchId: '',
    cuttingFabMchName: '',
    cuttingMchId: '',
    cuttingMchName: '',
    chromateMchId: '',
    chromateMchName: '',
    preChromateMchId: '',
    preChromateMchName: '',
    bubutMchId: '',
    bubutMchName: '',
    nitridMchId: '',
    nitridMchName: '',
    lotMchId: '',
    lotMchName: '',
    cncMchId: '',
    cncMchName: '',
    fmMchId: '',
    fmMchName: '',
    hdMchId: '',
    hdMchName: '',
    finish_bubutMchId: '',
    finish_bubutMchName: '',
    grindingMchId: '',
    grindingMchName: '',
    WirecutMchId: '',
    WirecutMchName: '',
    edmMchId: '',
    edmMchName: '',
    borMchId: '',
    borMchName: '',
    millingMchId: '',
    millingMchName: '',
    snblMchId: '',
    snblMchName: '',
    rollMchId: '',
    rollMchName: '',
    treatMchId: '',
    treatMchName: '',
    qcType: '',
    errorMch: '',
    errorShf: '',
    errorSpv: '',
  });
  const { type } = useRouter().query;
  const odoo = new OdooLib();
  const comboBox = (idintifier,tyype, label, change) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
      let active = true;

      if (!loading) {
        return undefined;
      }

      (async () => {
        let dt = [];
        if (tyype === 'machine') {
          if (type === 'searchRack') {
            dt = await odoo.getMachine([
              'press',
              'etching',
              'cutting_fab',
              'chromate',
            ]);
          } else if (type === 'searchPress') {
            dt = await odoo.getMachine(['press']);
          } else if (type === 'die') {
            dt = await odoo.getMachine(['die_oven']);
          } else if (type === 'startEndOvenRackingUnracking?type=oven') {
            dt = await odoo.getMachine(['oven']);
          } else if (type === 'startEndOvenRackingUnracking?type=treatment') {
            dt = await odoo.getMachine(['treatment']);
          } else if (type === 'startEndOvenRackingUnracking?type=racking') {
            dt = await odoo.getMachine(['racking']);
          } else if (type === 'startEndOvenRackingUnracking?type=unracking') {
            dt = await odoo.getMachine(['unracking']);
          } else if (type === 'startEndOvenRackingUnracking?type=anodize') {
            dt = await odoo.getMachine(['anodize']);
          } else if (type === 'listQc') {
            dt = await odoo.getMachine(['qcexport']);
          } else if (type === 'startEndOvenRackingUnracking?type=drawn') {
            dt = await odoo.getMachine(['drawn']);
          } else if (type === 'startEndOvenRackingUnracking?type=polish') {
            dt = await odoo.getMachine(['polish']);
          } else if (type === 'startEndOvenRackingUnracking?type=brush') {
            dt = await odoo.getMachine(['brush']);
          } else if (type === 'startEndOvenRackingUnracking?type=hole') {
            dt = await odoo.getMachine(['hole']);
          } else if (type === 'startEndOvenRackingUnracking?type=bending') {
            dt = await odoo.getMachine(['bending']);
          } else if (type === 'startEndOvenRackingUnracking?type=ulir') {
            dt = await odoo.getMachine(['ulir']);
          } else if (type === 'startEndOvenRackingUnracking?type=painting') {
            dt = await odoo.getMachine(['painting']);
          } else if (type === 'startEndOvenRackingUnracking?type=cutting') {
            dt = await odoo.getMachine(['cutting']);
          } else if (type === 'startEndOvenRackingUnracking?type=preChromate') {
            dt = await odoo.getMachine(['preChromate']);
          } else if (
            type === 'startEndOvenRackingUnracking?type=sandblasting'
          ) {
            dt = await odoo.getMachine(['sandblasting']);
          } else if (type === 'searchEtching?type=etching') {
            dt = await odoo.getMachine(['etching']);
          } else if (type === 'searchEtching?type=cutting_fab') {
            dt = await odoo.getMachine(['cutting_fab']);
          } else if (type === 'searchEtching?type=chromate') {
            dt = await odoo.getMachine(['chromate']);
          } else if (type === 'searchBubut') {
            dt = await odoo.getMachine(['bubut']);
          } else if (type === 'searchPotong') {
            dt = await odoo.getMachine(['potong']);
          } else if (type === 'nitrid') {
            dt = await odoo.getMachine(['nitrid']);
          } else if (type === 'roll') {
            dt = await odoo.getMachine(['roll']);
          } else if (type === 'production') {
            dt = await odoo.getMachine(['lot']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=cnc'
          ) {
            dt = await odoo.getMachine(['cnc']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=bubut'
          ) {
            dt = await odoo.getMachine(['bubut']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=fm'
          ) {
            dt = await odoo.getMachine(['fm']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=hd'
          ) {
            dt = await odoo.getMachine(['hd']);
          } else if (
            type.substring(0, type.indexOf('&')) ===
            'searchcd?code=finish_bubut'
          ) {
            dt = await odoo.getMachine(['finish_bubut']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=grinding'
          ) {
            dt = await odoo.getMachine(['grinding']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=Wirecut'
          ) {
            dt = await odoo.getMachine(['Wirecut']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=edm'
          ) {
            dt = await odoo.getMachine(['edm']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=bor'
          ) {
            dt = await odoo.getMachine(['bor']);
          } else if (
            type.substring(0, type.indexOf('&')) === 'searchcd?code=milling'
          ) {
            dt = await odoo.getMachine(['milling']);
          } else if (type === 'searchMelting') {
            dt = await odoo.getMachine(['melting']);
          }
        } else if (tyype === 'Spv') {
          dt = await odoo.getUser('');
        } else {
          dt = await odoo.getShift();
        }
        if (active) {
          setOptions(dt);
        }
      })();

      return () => {
        active = false;
      };
    }, [loading]);

    React.useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [open]);

    return (
      <Autocomplete
        id={idintifier}
        name={idintifier}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={change}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            onChange={async (e) => {
              if (tyype === 'Spv' && e.target.value) {
                const dt = await odoo.getUser(e.target.value);
                setOptions(dt);
              }
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    );
  };

  const chMch = (value) => {
    if (type === 'die') {
      setState({
        ...state,
        dieMchId: value.id,
        dieMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchRack') {
      setState({
        ...state,
        palletMchId: value.id,
        palletMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchPress') {
      setState({
        ...state,
        pressMchId: value.id,
        pressMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=oven') {
      setState({
        ...state,
        ovenMchId: value.id,
        ovenMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=racking') {
      setState({
        ...state,
        rackingMchId: value.id,
        rackingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=unracking') {
      setState({
        ...state,
        unrackingMchId: value.id,
        unrackingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=treatment') {
      setState({
        ...state,
        treatMchId: value.id,
        treatMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=anodize') {
      setState({
        ...state,
        anodizeMchId: value.id,
        anodizeMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=drawn') {
      setState({
        ...state,
        drawnMchId: value.id,
        drawnMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=polish') {
      setState({
        ...state,
        polishMchId: value.id,
        polishMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=brush') {
      setState({
        ...state,
        brushMchId: value.id,
        brushMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=hole') {
      setState({
        ...state,
        holeMchId: value.id,
        holeMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=bending') {
      setState({
        ...state,
        bendingMchId: value.id,
        bendingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=ulir') {
      setState({
        ...state,
        ulirMchId: value.id,
        ulirMchName: value.name,
      });
    } else if (type === 'startEndOvenRackingUnracking?type=painting') {
      setState({
        ...state,
        paintingMchId: value.id,
        paintingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=cutting') {
      setState({
        ...state,
        cuttingMchId: value.id,
        cuttingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=sandblasting') {
      setState({
        ...state,
        snblMchId: value.id,
        snblMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchEtching?type=etching') {
      setState({
        ...state,
        etchingMchId: value.id,
        etchingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchEtching?type=cutting_fab') {
      setState({
        ...state,
        cuttingFabMchId: value.id,
        cuttingFabMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchEtching?type=chromate') {
      setState({
        ...state,
        chromateMchId: value.id,
        chromateMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchBubut') {
      setState({
        ...state,
        bubutMchId: value.id,
        bubutMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchPotong') {
      setState({
        ...state,
        potongMchId: value.id,
        potongMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'startEndOvenRackingUnracking?type=preChromate') {
      setState({
        ...state,
        preChromateMchId: value.id,
        preChromateMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'nitrid') {
      setState({
        ...state,
        nitridMchId: value.id,
        nitridMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'roll') {
      setState({
        ...state,
        rollMchId: value.id,
        rollMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'searchMelting') {
      setState({
        ...state,
        meltingMchId: value.id,
        meltingMchName: value.name,
        errorMch: '',
      });
    } else if (type === 'production') {
      setState({
        ...state,
        lotMchId: value.id,
        lotMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=cnc') {
      setState({
        ...state,
        cncMchId: value.id,
        cncMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=bubut') {
      setState({
        ...state,
        bubutMchId: value.id,
        bubutMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=fm') {
      setState({
        ...state,
        fmMchId: value.id,
        fmMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=hd') {
      setState({
        ...state,
        hdMchId: value.id,
        hdMchName: value.name,
        errorMch: '',
      });
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=finish_bubut'
    ) {
      setState({
        ...state,
        finish_bubutMchId: value.id,
        finish_bubutMchName: value.name,
        errorMch: '',
      });
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=grinding'
    ) {
      setState({
        ...state,
        grindingMchId: value.id,
        grindingMchName: value.name,
        errorMch: '',
      });
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=Wirecut'
    ) {
      setState({
        ...state,
        WirecutMchId: value.id,
        WirecutMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=edm') {
      setState({
        ...state,
        edmMchId: value.id,
        edmMchName: value.name,
        errorMch: '',
      });
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=bor') {
      setState({
        ...state,
        borMchId: value.id,
        borMchName: value.name,
        errorMch: '',
      });
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=milling'
    ) {
      setState({
        ...state,
        millingMchId: value.id,
        millingMchName: value.name,
        errorMch: '',
      });
    }
  };

  const changeMachine = (event, value) => {
    if (value) {
      chMch(value);
    } else {
      chMch({ id: '', name: '' });
    }
  };

  const changeShift = (event, value) => {
    if (value) {
      setState({
        ...state,
        shiftId: value.id,
        shiftName: value.name,
        errorShf: '',
      });
    } else {
      setState({
        ...state,
        shiftId: '',
        shiftName: '',
      });
    }
  };

  const changeSpv = (event, value) => {
    if (value) {
      setState({
        ...state,
        spvId: value.id,
        spvName: value.name,
        errorSpv: '',
      });
    } else {
      setState({
        ...state,
        spvId: '',
        spvName: '',
      });
    }
  };

  const cekMch = () => {
    let result;
    if (type === 'die') {
      result = state.dieMchId;
    } else if (type === 'searchRack') {
      result = state.palletMchId;
    } else if (type === 'searchPress') {
      result = state.pressMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=oven') {
      result = state.ovenMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=treatment') {
      result = state.treatMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=racking') {
      result = state.rackingMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=unracking') {
      result = state.unrackingMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=anodize') {
      result = state.anodizeMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=sandblasting') {
      result = state.snblMchId;
    } else if (
      type === 'listQc' ||
      (type.match(/[^?]*/i) && type.match(/[^?]*/i)[0] === 'searchCorr')
    ) {
      result = true;
    } else if (type === 'startEndOvenRackingUnracking?type=drawn') {
      result = state.drawnMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=polish') {
      result = state.polishMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=brush') {
      result = state.brushMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=hole') {
      result = state.holeMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=bending') {
      result = state.bendingMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=ulir') {
      result = state.ulirMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=painting') {
      result = state.paintingMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=cutting') {
      result = state.cuttingMchId;
    } else if (type === 'startEndOvenRackingUnracking?type=preChromate') {
      result = state.preChromateMchId;
    } else if (type === 'searchEtching?type=etching') {
      result = state.etchingMchId;
    } else if (type === 'searchEtching?type=cutting_fab') {
      result = state.cuttingFabMchId;
    } else if (type === 'searchEtching?type=chromate') {
      result = state.chromateMchId;
    } else if (type === 'searchBubut') {
      result = state.bubutMchId;
    } else if (type === 'searchPotong') {
      result = state.potongMchId;
    } else if (type === 'nitrid') {
      result = state.nitridMchId;
    } else if (type === 'roll') {
      result = state.rollMchId;
    } else if (type === 'searchMelting') {
      result = state.meltingMchId;
    } else if (type === 'production') {
      result = state.lotMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=cnc') {
      result = state.cncMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=bubut') {
      result = state.bubutMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=fm') {
      result = state.fmMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=hd') {
      result = state.hdMchId;
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=finish_bubut'
    ) {
      result = state.finish_bubutMchId;
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=grinding'
    ) {
      result = state.grindingMchId;
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=Wirecut'
    ) {
      result = state.WirecutMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=edm') {
      result = state.edmMchId;
    } else if (type.substring(0, type.indexOf('&')) === 'searchcd?code=bor') {
      result = state.borMchId;
    } else if (
      type.substring(0, type.indexOf('&')) === 'searchcd?code=milling'
    ) {
      result = state.millingMchId;
    }
    return result;
  };

  const cekSpv = () => {
    if (type === 'searchPress') {
      if (!state.spvId || state.spvId === '') {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsgBox({ variant: 'success', message: '' });
    if (state.shiftId && cekMch() && cekSpv()) {
      setLoading(true);
      try {
        localStorage.setItem('shiftId', state.shiftId);
        localStorage.setItem('shiftName', state.shiftName);

        if (type === 'die') {
          localStorage.setItem('dieMchId', state.dieMchId);
          localStorage.setItem('dieMchName', state.dieMchName);
        } else if(type === 'listQc') {
          localStorage.setItem('wcType', state.qcType)
        } else if (type === 'searchRack') {
          localStorage.setItem('palletMchId', state.palletMchId);
          localStorage.setItem('palletMchName', state.palletMchName);
        } else if (type === 'searchPress') {
          localStorage.setItem('pressMchId', state.pressMchId);
          localStorage.setItem('pressMchName', state.pressMchName);
          localStorage.setItem('spvId', state.spvId);
          localStorage.setItem('spvName', state.spvName);
        } else if (type === 'startEndOvenRackingUnracking?type=oven') {
          localStorage.setItem('ovenMchId', state.ovenMchId);
          localStorage.setItem('ovenMchName', state.ovenMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=treatment') {
          localStorage.setItem('treatMchId', state.treatMchId);
          localStorage.setItem('treatMchName', state.treatMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=racking') {
          localStorage.setItem('rackingMchId', state.rackingMchId);
          localStorage.setItem('rackingMchName', state.rackingMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=unracking') {
          localStorage.setItem('unrackingMchId', state.unrackingMchId);
          localStorage.setItem('unrackingMchName', state.unrackingMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=anodize') {
          localStorage.setItem('anodizeMchId', state.anodizeMchId);
          localStorage.setItem('anodizeMchName', state.anodizeMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=drawn') {
          localStorage.setItem('drawnMchId', state.drawnMchId);
          localStorage.setItem('drawnMchName', state.drawnMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=polish') {
          localStorage.setItem('polishMchId', state.polishMchId);
          localStorage.setItem('polishMchName', state.polishMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=brush') {
          localStorage.setItem('brushMchId', state.brushMchId);
          localStorage.setItem('brushMchName', state.brushMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=hole') {
          localStorage.setItem('holeMchId', state.holeMchId);
          localStorage.setItem('holeMchName', state.holeMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=bending') {
          localStorage.setItem('bendingMchId', state.bendingMchId);
          localStorage.setItem('bendingMchName', state.bendingMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=ulir') {
          localStorage.setItem('ulirMchId', state.ulirMchId);
          localStorage.setItem('ulirMchName', state.ulirMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=painting') {
          localStorage.setItem('paintingMchId', state.paintingMchId);
          localStorage.setItem('paintingMchName', state.paintingMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=cutting') {
          localStorage.setItem('cuttingMchId', state.cuttingMchId);
          localStorage.setItem('cuttingMchName', state.cuttingMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=preChromate') {
          localStorage.setItem('preChromateMchId', state.preChromateMchId);
          localStorage.setItem('preChromateMchName', state.preChromateMchName);
        } else if (type === 'startEndOvenRackingUnracking?type=sandblasting') {
          localStorage.setItem('snblMchId', state.snblMchId);
          localStorage.setItem('snblMchName', state.snblMchName);
        } else if (type === 'searchEtching?type=etching') {
          localStorage.setItem('etchingMchId', state.etchingMchId);
          localStorage.setItem('etchingMchName', state.etchingMchName);
        } else if (type === 'searchEtching?type=cutting_fab') {
          localStorage.setItem('cuttingFabMchId', state.cuttingFabMchId);
          localStorage.setItem('cuttingFabMchName', state.cuttingFabMchName);
        } else if (type === 'searchEtching?type=chromate') {
          localStorage.setItem('chromateMchId', state.chromateMchId);
          localStorage.setItem('chromateMchName', state.chromateMchName);
        } else if (type === 'searchBubut') {
          localStorage.setItem('bubutMchId', state.bubutMchId);
          localStorage.setItem('bubutMchName', state.bubutMchName);
        } else if (type === 'searchPotong') {
          localStorage.setItem('potongMchId', state.potongMchId);
          localStorage.setItem('potongMchName', state.potongMchName);
        } else if (type === 'nitrid') {
          localStorage.setItem('nitridMchId', state.nitridMchId);
          localStorage.setItem('nitridMchName', state.nitridMchName);
        } else if (type === 'roll') {
          localStorage.setItem('rollMchId', state.rollMchId);
          localStorage.setItem('rollMchName', state.rollMchName);
        } else if (type === 'searchMelting') {
          localStorage.setItem('meltingMchId', state.meltingMchId);
          localStorage.setItem('meltingMchName', state.meltingMchName);
        } else if (type === 'production') {
          localStorage.setItem('lotMchId', state.lotMchId);
          localStorage.setItem('lotMchName', state.lotMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=cnc'
        ) {
          localStorage.setItem(`cncMchId`, state.cncMchId);
          localStorage.setItem(`cncMchName`, state.cncMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=bubut'
        ) {
          localStorage.setItem(`bubutMchId`, state.bubutMchId);
          localStorage.setItem(`bubutMchName`, state.bubutMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=fm'
        ) {
          localStorage.setItem(`fmMchId`, state.fmMchId);
          localStorage.setItem(`fmMchName`, state.fmMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=hd'
        ) {
          localStorage.setItem(`hdMchId`, state.hdMchId);
          localStorage.setItem(`hdMchName`, state.hdMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=finish_bubut'
        ) {
          localStorage.setItem(`finish_bubutMchId`, state.finish_bubutMchId);
          localStorage.setItem(
            `finish_bubutMchName`,
            state.finish_bubutMchName
          );
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=grinding'
        ) {
          localStorage.setItem(`grindingMchId`, state.grindingMchId);
          localStorage.setItem(`grindingMchName`, state.grindingMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=Wirecut'
        ) {
          localStorage.setItem(`WirecutMchId`, state.WirecutMchId);
          localStorage.setItem(`WirecutMchName`, state.WirecutMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=edm'
        ) {
          localStorage.setItem(`edmMchId`, state.edmMchId);
          localStorage.setItem(`edmMchName`, state.edmMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=bor'
        ) {
          localStorage.setItem(`borMchId`, state.borMchId);
          localStorage.setItem(`borMchName`, state.borMchName);
        } else if (
          type.substring(0, type.indexOf('&')) === 'searchcd?code=milling'
        ) {
          localStorage.setItem(`millingMchId`, state.millingMchId);
          localStorage.setItem(`millingMchName`, state.millingMchName);
        }

        Router.push(`/${type}`);
      } catch (err) {
        setMsgBox({ message: err.message, variant: 'error' });
        setLoading(false);
      }
    } else {
      if (!state.errorMch || !state.errorShf || !state.errorSpv) {
        setState({
          ...state,
          errorMch: !cekMch() ? 'field Mch cannot be empty' : '',
          errorShf: !state.shiftId ? 'field Shift cannot be empty' : '',
          errorSpv: !cekSpv() ? 'field SPV cannot be empty' : '',
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ALUBLESS - Login</title>
      </Head>
      <Fade in>
        <Box className={classes.root}>
          <Paper className={classes.paper} elevation={0}>
            <form onSubmit={handleSubmit}>
              <Box className="row">
                <Box className="col">
                  {type !== 'listQc' &&
                  type.match(/[^?]*/i)[0] !== 'searchCorr' ? (
                    <Box className="machine">
                      {comboBox('machine_id','machine', 'Machine', changeMachine)}
                      {state.errorMch && (
                        <span style={{ color: 'red' }}>{state.errorMch}</span>
                      )}
                    </Box>
                  ) : (
                    ''
                  )}
                  <Box className="shift">
                    {comboBox('shift_id','shift', 'Shift', changeShift)}
                    {state.errorShf && (
                      <span style={{ color: 'red' }}>{state.errorShf}</span>
                    )}
                  </Box>
                  {type === 'searchPress' ? (
                    <Box>
                      {comboBox('spv_id','Spv', 'SPV', changeSpv)}
                      {state.errorSpv && (
                        <span style={{ color: 'red' }}>{state.errorSpv}</span>
                      )}
                    </Box>
                  ) : (
                    ''
                  )}
                 
                  {
                    type === 'listQc' ? 
                      (<Box>
                        <Autocomplete
                          id="qc_type"
                          openOnFocus
                          options={[
                            {'title': 'QC Export', 'value': 'packing_exp'},
                            {'title': 'QC Local / Stock', 'value': 'packing'},
                            {'title': 'QC FI', 'value': 'qcfi'}
                          ]}
                          onChange={(event, newVal) => {
                            if (!!newVal){
                                setState({
                                  ...state,
                                  qcType: newVal.value
                                })
                            }
                          }}
                          required
                        
                          error={!state.qcType}
                          getOptionLabel={(data) => data.title}
                          renderInput={(params) => 
                          <TextField {...params} label="QC Type" margin="normal" />}
                        />
                      </Box>) : ''
                  }
                

                  <Box className={classes.wrapper}>
                    <Button
                      variant="contained"
                      className={classes.btnStyle}
                      fullWidth
                      type="submit"
                      disabled={load}
                    >
                      SAVE
                    </Button>

                    {load ? (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgressLoading}
                      />
                    ) : (
                      <SnackbarMessage
                        message={msgBox.message}
                        variant={msgBox.variant}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </Fade>
    </>
  );
};

export default MachinePage;

MachinePage.propTypes = {
  setTitle: PropTypes.func.isRequired,
};
