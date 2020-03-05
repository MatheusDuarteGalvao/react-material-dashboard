import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  listar,
  salvar
} from '../../store/tarefasReducer';

import { TarefasToolbar, TarefasTable } from './components';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TarefaList = (props) => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); 
  const [mensagem, setMensagem] = useState('');

  const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';

  const alterarStatus = (id) => {
    axios.patch(`${API_URL}/${id}`, null, {
      headers: { 'x-tenant-id' : localStorage.getItem('email_usuario_logado') }
    }).then( response => {
      const lista = [...tarefas]
      lista.forEach(tarefa => {
        if(tarefa.id === id){
          tarefa.done = true;
        }
      })
      setTarefas(lista)
      setOpenDialog(true)
      setMensagem('Iem atualizado com sucesso')
    }).catch( erro => {
      setMensagem('Ocorreu um erro')
      setOpenDialog(true)
    })
  }

  const deletar = (id) => {
    axios.delete(`${API_URL}/${id}`, { 
      headers: { 'x-tenant-id' : localStorage.getItem('email_usuario_logado') } 
    }).then(response => {
      const lista = tarefas.filter( tarefa => tarefa.id !== id)
      setTarefas(lista)
      setOpenDialog(true)
      setMensagem('Item removido com sucesso')
    }).catch( erro => {
      setMensagem('Ocorreu um erro')
      setOpenDialog(true)
    })
  }

  useEffect(() => {
    props.listar();
  }, [] )
 
  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={props.salvar} />
      <div className={classes.content}>
        <TarefasTable alterarStatus={alterarStatus}
                      deleteAction={deletar}
                      tarefas={props.tarefas} />
      </div>
      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  tarefas: state.tarefas.tarefas
})

const mapDispatchToProps = dispatch => 
  bindActionCreators({listar, salvar}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps) (TarefaList);
