import { useEffect, useState } from "react";
import StickyHeadTable, { Coluna } from "../../components/StickyHeadTable";
import { Box, CircularProgress, Container } from "@mui/material";
import IRevisao from "../../types/revisao";
import IAcao from "../../types/acao";
import BasicSnackbar, { IBasicSnackbar } from "../../components/BasicSnackbar";
import useGet from "../../requests/axios/get";
import { useParams } from "react-router-dom";
import usePost from "../../requests/axios/post";
import usePut from "../../requests/axios/put";
import useDelete from "../../requests/axios/delete";
import ConfirmationModal, { IConfirmationModal } from "../../components/ConfirmationModal";
import { formataDinheiro } from "../../utils/formataDinheiro";
import { formataDataISOParaBR } from "../../utils/formataDataISOParaBR";
import { formataDataBRParaISO } from "../../utils/formataDataBRparaISO";
import ISituacao from "../../types/situacao";
import usePostFile from "../../requests/axios/postFile";

export default function Projetos() {
  // FLAGS
  const idProjeto = useParams().id;
  const [idRevisao, setIdRevisao] = useState<string | number>("");
  const [flagGetRevisoes, setFlagGetRevisoes] = useState(0);
  const [flagGetAcoes, setFlagGetAcoes] = useState(0);

  const [situacaoRevisao, setSituacaoRevisao] = useState<ISituacao | null>(null);
  const [situacaoAcao, setSituacaoAcao] = useState<ISituacao | null>(null);

  // REQUISIÇÕES
  const { dados: dadosSituacoes, carregando: carregandoSituacoes } = useGet<ISituacao[]>("util/status", [])
  const { dados: dadosRevisoes, carregando: carregandoRevisoes } = useGet<IRevisao[]>(`revisao/${idProjeto}`, [flagGetRevisoes]);
  const { dados: dadosAcoes, carregando: carregandoAcoes } = useGet<IAcao[]>(`acao/${idRevisao}`, [flagGetAcoes]);
  const { post, carregando: carregandoPost } = usePost();
  const { postFile, carregando: carregandoPostFile } = usePostFile();
  const { put, carregando: carregandoPut } = usePut();
  const { del, carregando: carregandoDelete } = useDelete();
  const [carregando, setCarregando] = useState(false);

  // SNACKBAR
  const [snackbar, setSnackbar] = useState<IBasicSnackbar>({
    open: false,
    message: ""
  });

  // MODAL DE CONFIRMAÇÃO
  const [modalConfirmacao, setModalConfirmacao] = useState<IConfirmationModal>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => null,
    onCancel: () => null
  });

  // SITUAÇÕES
  const [situacoes, setSituacoes] = useState<ISituacao[]>([]);

  // TABELA REVISÃO
  const [modoTabelaRevisao, setModoTabelaRevisao] = useState<"add" | "edit" | "view">("view");
  const [revisoes, setRevisoes] = useState<IRevisao[]>([]);
  const [revisoesBackup, setRevisoesBackup] = useState<IRevisao[]>([]);
  const colunasRevisoes: Coluna[] = [
    {
      id: "id",
      label: "Código",
      minWidth: 70,
      maxWidth: 70,
      readonly: true
    },
    {
      id: "titulo",
      label: "Título",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "descricao",
      label: "Descrição",
      minWidth: 250,
      maxWidth: 250
    },
    {
      id: "justificativa",
      label: "Justificativa",
      minWidth: 220,
      maxWidth: 220
    },
    {
      id: "solicitante",
      label: "Solicitante",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "aprovador",
      label: "Aprovador",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "executor",
      label: "Executor",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "situacao",
      label: "Situação",
      minWidth: 150,
      maxWidth: 150,
      comboBoxProps: {
        options: situacoes,
        displayKey: "nome",
        valueKey: "id",
        value: situacaoRevisao,
        onChange: (newValue) => {
          console.log(newValue)
          setSituacaoRevisao(newValue)
        }
      }
    },
    {
      id: "tipo",
      label: "Tipo",
      minWidth: 100,
      maxWidth: 100
    },
    {
      id: "sprint",
      label: "Sprint",
      minWidth: 100,
      maxWidth: 100
    },
    {
      id: "retornoEsperado",
      label: "Retorno",
      minWidth: 100,
      maxWidth: 100,
      align: "right",
      maskType: "money",
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          return formataDinheiro(value);
        }
        else if (!value) {
          return ""
        }
        return String(value);
      }
    },
    {
      id: "dataAprovacao",
      label: "Aprovação",
      minWidth: 120,
      maxWidth: 120,
      align: "right",
      maskType: "date",
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          return formataDataISOParaBR(value);
        }
        else if (!value) {
          return ""
        }
        return String(value);
      }
    },
    {
      id: "dataCriacao",
      label: "Criação",
      minWidth: 120,
      maxWidth: 120,
      align: "right",
      readonly: true,
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          return formataDataISOParaBR(value);
        }
        else if (!value) {
          return ""
        }
        return String(value);
      }
    },
  ];

  // TABELA AÇÃO
  const [modoTabelaAcao, setModoTabelaAcao] = useState<"add" | "edit" | "view">("view");
  const [acoes, setAcoes] = useState<IAcao[]>([]);
  const [acoesBackup, setAcoesBackup] = useState<IAcao[]>([]);
  const colunasAcoes: Coluna[] = [
    {
      id: "id",
      label: "Código",
      minWidth: 70,
      maxWidth: 70,
      readonly: true
    },
    {
      id: "titulo",
      label: "Título",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "descricao",
      label: "Descrição",
      minWidth: 250,
      maxWidth: 250
    },
    {
      id: "cliente",
      label: "Cliente",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "executor",
      label: "Executor",
      minWidth: 140,
      maxWidth: 140
    },
    {
      id: "situacao",
      label: "Situação",
      minWidth: 150,
      maxWidth: 150,
      comboBoxProps: {
        options: situacoes,
        displayKey: "nome",
        valueKey: "id",
        value: situacaoAcao,
        onChange: (newValue) => {
          console.log(newValue)
          setSituacaoAcao(newValue)
        }
      }
    },
    {
      id: "dataPrevista",
      label: "Previsão",
      minWidth: 120,
      maxWidth: 120,
      maskType: "date",
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          return formataDataISOParaBR(value);
        }
        else if (!value) {
          return ""
        }
        return String(value);
      }
    },
    {
      id: "dataCriacao",
      label: "Criação",
      minWidth: 120,
      maxWidth: 120,
      align: "right",
      readonly: true,
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          return formataDataISOParaBR(value);
        }
        else if (!value) {
          return ""
        }
        return String(value);
      }
    },
  ];

  // FUNÇÕES REVISÃO
  const adicionarRevisao = () => {
    setModoTabelaRevisao("add");

    const novaRevisao = {
      id: "",
      acoes: [],
      aprovador: "",
      dataAprovacao: "",
      dataCriacao: "",
      descricao: "",
      executor: "",
      justificativa: "",
      retornoEsperado: "",
      solicitante: "",
      tipo: "",
      titulo: ""
    }

    setRevisoes([novaRevisao, ...revisoes]);
    setSituacaoRevisao(null);
  };
  const editarRevisao = (idRevisao: number) => {
    setModoTabelaRevisao("edit");
    setRevisoesBackup(revisoes);

    const revisaoSelecionada = revisoes.find(revisao => revisao.id === idRevisao);
    if (revisaoSelecionada) {
      const stringSituacaoRevisaoSelecionada = revisaoSelecionada.situacao;
      const objetoSituacaoRevisaoSelecionada = situacoes.find(situacao => situacao.nome === stringSituacaoRevisaoSelecionada);

      if (objetoSituacaoRevisaoSelecionada) {
        setSituacaoRevisao(objetoSituacaoRevisaoSelecionada);
      }
    }
  };
  const alterarRevisao = (novaPropriedade: any, idRevisao: number, nomePropriedade: string) => {
    setRevisoes((prev) =>
      prev.map((revisao =>
        revisao.id === idRevisao ? { ...revisao, [nomePropriedade]: novaPropriedade } : revisao)));
  };
  const cancelarAlteracaoRevisao = () => {
    if (modoTabelaRevisao === "edit") {
      setRevisoes(revisoesBackup);
    }
    else if (modoTabelaRevisao === "add") {
      setRevisoes(revisoes.slice(1));
    }
    setModoTabelaRevisao("view");
  };
  const salvarRevisao = async (idRevisao: number) => {
    const revisao = revisoes.find((revisao => revisao.id === (modoTabelaRevisao === "edit" ? idRevisao : "")));

    if (revisao && situacaoRevisao) {
      const {
        dataCriacao,
        idProjeto: objetoProjeto,
        id,
        ...revisaoFormatada
      } = revisao;

      revisaoFormatada.dataAprovacao = formataDataBRParaISO(revisaoFormatada.dataAprovacao);
      revisaoFormatada.situacao = situacaoRevisao.id;

      try {
        let resposta;
        if (modoTabelaRevisao === "edit") {
          resposta = await put(`revisao/${idRevisao}`, revisaoFormatada);
        }
        else if (modoTabelaRevisao === "add") {
          resposta = await post(`revisao/${idProjeto}`, revisaoFormatada);
        }
        console.log(resposta);
        setFlagGetRevisoes(prev => prev + 1);
        setSituacaoRevisao(null);
        setSnackbar({
          open: true,
          message: modoTabelaRevisao === "add" ?
            "Revisão cadastrada com sucesso!" :
            modoTabelaRevisao === "edit" ?
              "Revisão atualizada com sucesso!" :
              "",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setFlagGetRevisoes(prev => prev + 1);
        setSituacaoRevisao(null);
        setSnackbar({
          open: true,
          message: modoTabelaRevisao === "add" ?
            "Erro ao cadastrar a revisão!" :
            modoTabelaRevisao === "edit" ?
              "Erro ao atualizar a revisão!" :
              "",
          severity: "error"
        });
      }
    }
    setModoTabelaRevisao("view")
  };
  const enviarArquivoRevisao = async (arquivo: File, idRevisao: number) => {
    if (arquivo && idRevisao) {
      try {
        const resposta = await postFile(`revisao/upload/${idRevisao}`, arquivo);
        console.log(resposta);
        setFlagGetRevisoes(prev => prev + 1);
        setSnackbar({
          open: true,
          message: "Upload concluído com sucesso!",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setSnackbar({
          open: true,
          message: "Erro ao anexar o arquivo!",
          severity: "error"
        });
      }
    }
  };
  const baixarArquivoRevisao = async (idRevisao: number) => {
    if (idRevisao) {
      try {
        const url = `http://192.168.228.8:8082/revisao/download/${idRevisao}`;
        const resposta = await fetch(url);
        const blob = await resposta.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `P${idProjeto}R${idRevisao}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(urlBlob);
        setSnackbar({
          open: true,
          message: "Download concluído com sucesso!",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setSnackbar({
          open: true,
          message: "Erro ao baixar o arquivo!",
          severity: "error"
        });
      }
    }
  };
  const deletarRevisao = (idRevisao: number) => {
    setModalConfirmacao({
      open: true,
      title: "Confirmar exclusão",
      message: "Tem certeza de que deseja excluir esta revisão?",
      confirmButtonColor: "error",
      confirmButtonText: "Excluir",
      onConfirm: async () => {
        let resposta;
        try {
          resposta = await del(`revisao/${idRevisao}`);
          console.log(resposta);
          setFlagGetRevisoes(prev => prev + 1);
          setSnackbar({
            open: true,
            message: "Revisão excluída com sucesso!",
            severity: "success"
          });
        }
        catch (erro) {
          console.log(erro);
          setSnackbar({
            open: true,
            message: "Erro ao excluir a revisão!",
            severity: "error"
          });
        }
        setModalConfirmacao({ ...modalConfirmacao, open: false })
      },
      onCancel: () => {
        setModalConfirmacao({ ...modalConfirmacao, open: false })
      }
    });
  };

  // FUNÇÕES AÇÃO
  const adicionarAcao = () => {
    setModoTabelaAcao("add");

    const novaAcao = {
      id: "",
      cliente: "",
      dataCriacao: "",
      dataPrevista: "",
      descricao: "",
      executor: "",
      titulo: "",
    }

    setAcoes([novaAcao, ...acoes]);
    setSituacaoAcao(null);
  };
  const editarAcao = (idAcao: number) => {
    setModoTabelaAcao("edit");
    setAcoesBackup(acoes);

    const acaoSelecionada = acoes.find(acao => acao.id === idAcao);
    if (acaoSelecionada) {
      const stringSituacaoAcaoSelecionada = acaoSelecionada.situacao;
      const objetoSituacaoAcaoSelecionada = situacoes.find(situacao => situacao.nome === stringSituacaoAcaoSelecionada);

      if (objetoSituacaoAcaoSelecionada) {
        setSituacaoAcao(objetoSituacaoAcaoSelecionada);
      }
    }
  };
  const alterarAcao = (novaPropriedade: any, idAcao: number, nomePropriedade: string) => {
    setAcoes((prev) =>
      prev.map((acao =>
        acao.id === idAcao ? { ...acao, [nomePropriedade]: novaPropriedade } : acao)));
  };
  const cancelarAlteracaoAcao = () => {
    if (modoTabelaAcao === "edit") {
      setAcoes(acoesBackup);
    }
    else if (modoTabelaAcao === "add") {
      setAcoes(acoes.slice(1));
    }
    setModoTabelaAcao("view");
  };
  const salvarAcao = async (idAcao: number) => {
    const acao = acoes.find((acao => acao.id === (modoTabelaAcao === "edit" ? idAcao : "")));

    if (acao && situacaoAcao) {
      const {
        id,
        dataCricacao,
        ...acaoFormatada
      } = acao;

      acaoFormatada.dataPrevista = formataDataBRParaISO(acaoFormatada.dataPrevista);
      acaoFormatada.situacao = situacaoAcao.id;

      try {
        console.log(acaoFormatada.dataPrevista)
        let resposta;
        if (modoTabelaAcao === "edit") {
          resposta = await put(`acao/${idAcao}`, acaoFormatada);
        }
        else if (modoTabelaAcao === "add") {
          resposta = await post(`acao/${idRevisao}`, acaoFormatada);
        }
        console.log(resposta);
        setFlagGetAcoes(prev => prev + 1);
        setSituacaoAcao(null);
        setSnackbar({
          open: true,
          message: modoTabelaAcao === "add" ?
            "Ação cadastrada com sucesso!" :
            modoTabelaAcao === "edit" ?
              "Ação atualizada com sucesso!" :
              "",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setSituacaoAcao(null);
        setSnackbar({
          open: true,
          message: modoTabelaAcao === "add" ?
            "Erro ao cadastrar a ação!" :
            modoTabelaAcao === "edit" ?
              "Erro ao atualizar a ação!" :
              "",
          severity: "error"
        });
      }
    }
    setModoTabelaAcao("view");
  };
  const enviarArquivoAcao = async (arquivo: File, idAcao: number) => {
    if (arquivo && idAcao) {
      try {
        const resposta = await postFile(`acao/upload/${idAcao}`, arquivo);
        console.log(resposta);
        setFlagGetRevisoes(prev => prev + 1);
        setSnackbar({
          open: true,
          message: "Upload concluído com sucesso!",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setSnackbar({
          open: true,
          message: "Erro ao anexar o arquivo!",
          severity: "error"
        });
      }
    }
  };
  const baixarArquivoAcao = async (idAcao: number) => {
    if (idAcao) {
      try {
        const url = `http://192.168.228.8:8082/acao/download/${idAcao}`;
        const resposta = await fetch(url);
        const blob = await resposta.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `P${idProjeto}R${idRevisao}A${idAcao}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(urlBlob);
        setSnackbar({
          open: true,
          message: "Download concluído com sucesso!",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setSnackbar({
          open: true,
          message: "Erro ao baixar o arquivo!",
          severity: "error"
        });
      }
    }
  };
  const deletarAcao = (idAcao: number) => {
    setModalConfirmacao({
      open: true,
      title: "Confirmar exclusão",
      message: "Tem certeza de que deseja excluir esta ação?",
      confirmButtonColor: "error",
      confirmButtonText: "Excluir",
      onConfirm: async () => {
        let resposta;
        try {
          resposta = await del(`acao/${idAcao}`);
          console.log(resposta);
          setFlagGetAcoes(prev => prev + 1);
          setSnackbar({
            open: true,
            message: "Ação excluída com sucesso!",
            severity: "success"
          });
        }
        catch (erro) {
          console.log(erro);
          setSnackbar({
            open: true,
            message: "Erro ao excluir a ação!",
            severity: "error"
          });
        }
        setModalConfirmacao({ ...modalConfirmacao, open: false })
      },
      onCancel: () => {
        setModalConfirmacao({ ...modalConfirmacao, open: false })
      }
    });
  };

  // ATUALIZA FLAG COM O ID DA REVISÃO SELECIONADA
  const armazenaIdRevisao = (id: number) => {
    setIdRevisao(id);
  };

  // BUSCA REVISÕES
  useEffect(() => {
    if (dadosRevisoes) {
      setRevisoes(dadosRevisoes);
    }
  }, [dadosRevisoes]);

  // BUSCA AÇÕES
  useEffect(() => {
    if (dadosAcoes) {
      setAcoes(dadosAcoes);
    }
  }, [dadosAcoes]);

  // BUSCA LISTA DE SITUAÇÕES
  useEffect(() => {
    if (dadosSituacoes) {
      setSituacoes(dadosSituacoes);
    }
  }, [dadosSituacoes]);

  // VERIFICA SE ALGUMA REQUISIÇÃO ESTÁ CARREGANDO
  useEffect(() => {
    setCarregando(carregandoSituacoes || carregandoRevisoes || carregandoAcoes || carregandoPost || carregandoPostFile || carregandoPut || carregandoDelete);
  }, [carregandoSituacoes || carregandoRevisoes, carregandoAcoes, carregandoPost, carregandoPostFile, carregandoPut, carregandoDelete]);

  return (
    <Container
      disableGutters>
      {carregando && (
        <div
          style={{
            position: "absolute",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF20",
            zIndex: 100,
            width: "100%",
            height: "100%",
            color: "#FFF"
          }}
        >
          <CircularProgress size={80} color="inherit" />
        </div>
      )}
      <Box
        sx={{ margin: "1.5% 0" }}>
        <StickyHeadTable
          title="Revisões"
          columns={colunasRevisoes}
          data={revisoes}
          mode={modoTabelaRevisao}
          handleRowClick={armazenaIdRevisao}
          handleAdd={adicionarRevisao}
          handleEdit={editarRevisao}
          handleDataChange={alterarRevisao}
          handleSave={salvarRevisao}
          handleCancel={cancelarAlteracaoRevisao}
          handleDelete={deletarRevisao}
          handleFileUpload={enviarArquivoRevisao}
          handleFileDownload={baixarArquivoRevisao}
          maxHeight="30vh"
          hasVisualizeButton={false}
          hasAddButton
          hasBackButton
          hasFile
        />
      </Box>
      <Box
        sx={{ marginBottom: "1.5%" }}>
        <StickyHeadTable
          title="Ações"
          columns={colunasAcoes}
          data={acoes}
          mode={modoTabelaAcao}
          handleAdd={adicionarAcao}
          handleEdit={editarAcao}
          handleDataChange={alterarAcao}
          handleSave={salvarAcao}
          handleCancel={cancelarAlteracaoAcao}
          handleDelete={deletarAcao}
          handleFileUpload={enviarArquivoAcao}
          handleFileDownload={baixarArquivoAcao}
          maxHeight="30vh"
          hasVisualizeButton={false}
          hasAddButton={idRevisao ? true : false}
          hasFile
        />
      </Box>
      <ConfirmationModal
        open={modalConfirmacao.open}
        title={modalConfirmacao.title}
        message={modalConfirmacao.message}
        confirmButtonColor={modalConfirmacao.confirmButtonColor}
        confirmButtonText={modalConfirmacao.confirmButtonText}
        onConfirm={modalConfirmacao.onConfirm}
        onCancel={modalConfirmacao.onCancel}
      />
      <BasicSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
      />
    </Container>
  );
}