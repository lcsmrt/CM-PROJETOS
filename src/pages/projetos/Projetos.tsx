/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import StickyHeadTable, { Coluna } from "../../components/StickyHeadTable";
import IProjeto from "../../types/projeto";
import { Box, CircularProgress, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGet from "../../requests/axios/get";
import usePost from "../../requests/axios/post";
import usePut from "../../requests/axios/put";
import BasicSnackbar, { IBasicSnackbar } from "../../components/BasicSnackbar";
import ConfirmationModal, { IConfirmationModal } from "../../components/ConfirmationModal";
import useDelete from "../../requests/axios/delete";
import ISituacao from "../../types/situacao";

export default function Projetos() {
  // NAVEGAÇÃO
  const navegar = useNavigate();

  const [situacaoProjeto, setSituacaoProjeto] = useState<ISituacao | null>(null);
  const [situacoesProjeto, setSituacoesProjeto] = useState<ISituacao[]>([]);



  // REQUISIÇÕES
  const [carregando, setCarregando] = useState(false);
  const [flagGet, setFlagGet] = useState(0);
  const { dados: dadosSituacoes, carregando: carregandoSituacoes } = useGet<ISituacao[]>("util/status", [])
  interface IRespostaProjetos { content: IProjeto[]; }
  const { dados: dadosProjetos, carregando: carregandoProjetos } = useGet<IRespostaProjetos>("/projetos/projetos", [flagGet]);
  const { post, carregando: carregandoPost } = usePost();
  const { put, carregando: carregandoPut } = usePut();
  const { del, carregando: carregandoDelete } = useDelete();

  // SITUAÇÕES
  const [situacoes, setSituacoes] = useState<ISituacao[]>([]);

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

  // TABELA
  const [modo, setModo] = useState<"add" | "edit" | "view">("view");
  const colunas: Coluna[] = [
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
      minWidth: 130,
      maxWidth: 130
    },
    {
      id: "descricao",
      label: "Descrição",
      minWidth: 200,
      maxWidth: 200
    },
    {
      id: "solicitante",
      label: "Solicitante",
      minWidth: 150,
      maxWidth: 150
    },
    {
      id: "justificativa",
      label: "Justificativa",
      minWidth: 360,
      maxWidth: 360
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
        value: situacaoProjeto,
        onChange: (newValue) => {
          console.log(newValue)
          setSituacaoProjeto(newValue)
        }
      }
    },
    {
      id: "dataAbertura",
      label: "Abertura",
      minWidth: 120,
      maxWidth: 120,
      readonly: true,
      align: "right",
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
  ];
  const [projetos, setProjetos] = useState<IProjeto[]>([]);
  const [projetosBackup, setProjetosBackup] = useState<IProjeto[]>([]);

  const visualizar = (idProjeto: number) => {
    navegar(`/revisoes/${idProjeto}`)
  }
  const adicionar = () => {
    setModo("add");

    const novoProjeto = {
      id: "",
      titulo: "",
      descricao: "",
      solicitante: "",
      justificativa: "",
      dataAbertura: "",
      revisoes: []
    }

    setProjetos([novoProjeto, ...projetos]);
    setSituacaoProjeto(null);
  }
  const editar = (idProjeto: number) => {
    setModo("edit");
    setProjetosBackup(projetos);

    const projetoSelecionado = projetos.find(projeto => projeto.id === idProjeto);
    if (projetoSelecionado) {
      const stringSituacaoSelecionada = projetoSelecionado.situacao;
      const objetoSituacaoSelecionada = situacoes.find(situacao => situacao.nome === stringSituacaoSelecionada);

      if (objetoSituacaoSelecionada) {
        setSituacaoProjeto(objetoSituacaoSelecionada);
      }
    }
  };
  const alterarProjeto = (novaPropriedade: any, idProjeto: number, nomePropriedade: string) => {
    setProjetos((prev) =>
      prev.map((projeto =>
        projeto.id === idProjeto ? { ...projeto, [nomePropriedade]: novaPropriedade } : projeto)));
  }
  const cancelarAlteracao = () => {
    if (modo === "edit") {
      setProjetos(projetosBackup);
    }
    else if (modo === "add") {
      setProjetos(projetos.slice(1));
    }
    setModo("view");
  }
  const salvar = async (idProjeto: number) => {
    const projeto = projetos.find((projeto => projeto.id === (modo === "edit" ? idProjeto : "")));

    if (projeto && situacaoProjeto) {
      const { dataAbertura, id, ...projetoFormatado } = projeto;

      projetoFormatado.situacao = situacaoProjeto.id;

      try {
        let resposta;
        if (modo === "edit") {
          resposta = await put(`projetos/atualizar/${idProjeto}`, projetoFormatado);
        }
        else if (modo === "add") {
          resposta = await post("projetos/salvar", projetoFormatado);
        }
        console.log(resposta);
        setFlagGet(prev => prev + 1);
        setSnackbar({
          open: true,
          message: modo === "add" ?
            "Projeto cadastrado com sucesso!" :
            modo === "edit" ?
              "Projeto atualizado com sucesso!" :
              "",
          severity: "success"
        });
      }
      catch (erro) {
        console.log(erro);
        setFlagGet(prev => prev + 1);
        setSnackbar({
          open: true,
          message: modo === "add" ?
            "Erro ao cadastrar o projeto!" :
            modo === "edit" ?
              "Erro ao atualizar o projeto!" :
              "",
          severity: "error"
        });
      }
    }
    setModo("view")
  }
  const deletar = (idProjeto: number) => {
    setModalConfirmacao({
      open: true,
      title: "Confirmar exclusão",
      message: "Tem certeza de que deseja excluir este projeto?",
      confirmButtonColor: "error",
      confirmButtonText: "Excluir",
      onConfirm: async () => {
        let resposta;
        try {
          resposta = await del(`projetos/deletar/${idProjeto}`);
          console.log(resposta);
          setFlagGet(prev => prev + 1);
          setSnackbar({
            open: true,
            message: "Projeto excluído com sucesso!",
            severity: "success"
          });
        }
        catch (erro) {
          console.log(erro);
          setSnackbar({
            open: true,
            message: "Erro ao excluir o projeto!",
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
    if (dadosProjetos && dadosProjetos.content) {
      console.log(dadosProjetos);
      setProjetos(dadosProjetos.content);
    }
  }, [dadosProjetos]);
  useEffect(() => {
    if (dadosSituacoes) {
      setSituacoes(dadosSituacoes);
    }
  }, [dadosSituacoes]);

  useEffect(() => {
    setCarregando(carregandoProjetos || carregandoSituacoes || carregandoPost || carregandoPut || carregandoDelete);
  }, [carregandoProjetos, carregandoSituacoes, carregandoPost, carregandoPut, carregandoDelete]);

  return (
    <Container
      disableGutters >
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
        sx={{ margin: "1.5% 0" }}
      >
        <StickyHeadTable
          title="Projetos"
          columns={colunas}
          data={projetos}
          mode={modo}
          handleRowClick={() => null}
          handleVisualize={visualizar}
          handleAdd={adicionar}
          handleEdit={editar}
          handleDataChange={alterarProjeto}
          handleSave={salvar}
          handleCancel={cancelarAlteracao}
          handleDelete={deletar}
          minHeight="75vh"
          hasVisualizeButton
          hasAddButton
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