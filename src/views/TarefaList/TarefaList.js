import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { TarefasToolbar, TarefasTable } from './components';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TarefaList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);

  const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';
  const headers = { 'x-tenant-id' : 'matheusg223@hotmail.com' }

  const salvar = (tarefa) => {
    axios.post(API_URL, tarefa, {
      headers: headers
    }).then( response => {
      console.log(response.data)
    }).catch( erro => {
      console.log(erro)
    })
  }

  const listarTarefas = () => {
    axios.get(API_URL, {
      headers: headers
    }).then(response => {
      const listarTarefas = response.data
      setTarefas(listarTarefas)
    }).catch( erro => {
      console.log(erro)
    })
  }
 
  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable tarefas={tarefas} />
      </div>
    </div>
  );
};

export default TarefaList;
