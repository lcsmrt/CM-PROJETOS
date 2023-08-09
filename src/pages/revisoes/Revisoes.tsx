/** @jsxImportSource @emotion/react */
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

export default function Projetos() {
  // NAVEGAÇÃO
  const params = useParams();

  const idProjeto = params.id;
  const [idRevisao, setIdRevisao] = useState<string | number>("");

  const armazenaIdRevisao = (id: number) => {
    setIdRevisao(id);
  };

  // REQUISIÇÕES
  const [carregando, setCarregando] = useState(false);
  const [flagGetRevisoes, setFlagGetRevisoes] = useState(0);
  const { dados: dadosRevisoes, carregando: carregandoRevisoes, erro: erroRevisoes } = useGet<IRevisao[]>(`revisao/${idProjeto}`, [flagGetRevisoes]);
  const [flagGetAcoes, setFlagGetAcoes] = useState(0);
  const { dados: dadosAcoes, carregando: carregandoAcoes, erro: erroAcoes } = useGet<IAcao[]>(`acao/${idRevisao}`, [flagGetAcoes]);
  const { post, carregando: carregandoPost, erro: erroPost } = usePost();
  const { put, carregando: carregandoPut, erro: erroPut } = usePut();
  const { del, carregando: carregandoDelete, erro: erroDelete } = useDelete();

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

  // TABELAS
  const [modoTabelaRevisao, setModoTabelaRevisao] = useState<"add" | "edit" | "view">("view");
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
      minWidth: 180,
      maxWidth: 180
    },
    {
      id: "justificativa",
      label: "Justificativa",
      minWidth: 180,
      maxWidth: 180
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
        return String(value);
      }
    },
  ];
  const [revisoes, setRevisoes] = useState<IRevisao[]>([]);
  const [revisoesBackup, setRevisoesBackup] = useState<IRevisao[]>([]);

  const [modoTabelaAcao, setModoTabelaAcao] = useState<"add" | "edit" | "view">("view");
  const colunasAcoes: Coluna[] = [
    {
      id: "id",
      label: "Código",
      minWidth: 50,
      maxWidth: 50,
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
      minWidth: 180,
      maxWidth: 180
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
      id: "dataPrevista",
      label: "Previsão",
      minWidth: 100,
      maxWidth: 100,
      maskType: "date",
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          const data = new Date(value)
          const dia = String(data.getDate()).padStart(2, "0");
          const mes = String(data.getMonth() + 1).padStart(2, "0");
          const ano = data.getFullYear();

          return `${dia} / ${mes} / ${ano}`;
        }
        return String(value);
      }
    },
    {
      id: "dataCriacao",
      label: "Criação",
      minWidth: 100,
      maxWidth: 100,
      align: "right",
      readonly: true,
      format: (value: number | string) => {
        if (typeof (value) === "string" && value !== "") {
          const data = new Date(value)
          const dia = String(data.getDate()).padStart(2, "0");
          const mes = String(data.getMonth() + 1).padStart(2, "0");
          const ano = data.getFullYear();

          return `${dia} / ${mes} / ${ano}`;
        }
        return String(value);
      }
    },
  ]
  const [acoes, setAcoes] = useState<IAcao[]>([]);
  const [acoesBackup, setAcoesBackup] = useState<IAcao[]>([]);

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
  };
  const editarRevisao = () => {
    setModoTabelaRevisao("edit");
    setRevisoesBackup(revisoes);
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

    if (revisao) {
      const {
        dataCriacao,
        idProjeto,
        sprint,
        id,
        ...revisaoFormatada
      } = revisao;

      revisaoFormatada.dataAprovacao = formataDataBRParaISO(revisaoFormatada.dataAprovacao);

      try {
        let resposta;
        if (modoTabelaRevisao === "edit") {
          resposta = await put(`revisao/${params.id}`, revisaoFormatada);
        }
        else if (modoTabelaRevisao === "add") {
          resposta = await post(`revisao/${params.id}`, revisaoFormatada);
        }
        console.log(resposta);
        setFlagGetRevisoes(prev => prev + 1);
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
  };
  const editarAcao = () => {
    setModoTabelaAcao("edit");
    setAcoesBackup(acoes);
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

    if (acao) {
      const {
        id,
        dataCricacao,
        ...acaoFormatada
      } = acao;

      acaoFormatada.dataPrevista = formataDataBRParaISO(acaoFormatada.dataPrevista);

      try {
        console.log(acaoFormatada.dataPrevista)
        let resposta;
        if (modoTabelaAcao === "edit") {
          resposta = await put(`acao/${idRevisao}`, acaoFormatada);
        }
        else if (modoTabelaAcao === "add") {
          resposta = await post(`acao/${idRevisao}`, acaoFormatada);
        }
        console.log(resposta);
        setFlagGetAcoes(prev => prev + 1);
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
  const deletarAcao = () => {
    setModalConfirmacao({
      open: true,
      title: "Confirmar exclusão",
      message: "Tem certeza de que deseja excluir esta ação?",
      confirmButtonColor: "error",
      confirmButtonText: "Excluir",
      onConfirm: async () => {
        let resposta;
        try {
          resposta = await del(`acao/${idRevisao}`);
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

  useEffect(() => {
    if (dadosAcoes) {
      console.log(dadosAcoes);
      setAcoes(dadosAcoes);
    }
  }, [dadosAcoes]);
  useEffect(() => {
    if (dadosRevisoes) {
      console.log(dadosRevisoes);
      setRevisoes(dadosRevisoes);
    }
  }, [dadosRevisoes]);

  useEffect(() => {
    setCarregando(carregandoRevisoes || carregandoAcoes || carregandoPost || carregandoPut || carregandoDelete);
  }, [carregandoRevisoes, carregandoAcoes, carregandoPost, carregandoPut, carregandoDelete]);

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
          maxHeight="30vh"
          hideVisualizeButton
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
          maxHeight="30vh"
          hideVisualizeButton
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