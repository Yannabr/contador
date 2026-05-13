const API_URL = 'http://localhost:3000';

// =========================
// ENVIAR DADOS
// =========================
async function enviarDados() {

    const sensor = document.getElementById('sensor').value.trim();
    const valor = document.getElementById('valor').value;

    const status = document.getElementById('status');

    // Validação dos campos
    if (!sensor || !valor) {

        status.style.color = '#f87171';
        status.innerText = 'Preencha todos os campos.';
        return;
    }

    try {

        const response = await fetch(`${API_URL}/coleta`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                sensor,
                valor: Number(valor)
            })

        });

        // Verifica resposta do servidor
        if (!response.ok) {
            throw new Error('Erro ao salvar dados');
        }

        const resultado = await response.json();

        // Mensagem de sucesso
        status.style.color = '#4ade80';
        status.innerText = resultado.mensagem;

        // Limpa os inputs
        document.getElementById('sensor').value = '';
        document.getElementById('valor').value = '';

        // Atualiza tabela
        atualizarTabela();

    } catch (erro) {

        console.error('Erro:', erro);

        status.style.color = '#f87171';
        status.innerText = 'Erro ao enviar dados.';
    }
}

// =========================
// ATUALIZAR TABELA
// =========================
async function atualizarTabela() {

    const corpo = document.getElementById('tabela-corpo');

    try {

        const response = await fetch(`${API_URL}/historico`);

        // Verifica resposta
        if (!response.ok) {
            throw new Error('Erro ao carregar histórico');
        }

        const dados = await response.json();

        // Se não houver dados
        if (dados.length === 0) {

            corpo.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhuma leitura registrada.
                    </td>
                </tr>
            `;

            return;
        }

        // Monta linhas da tabela
        corpo.innerHTML = dados.map(item => `

            <tr>

                <td>
                    ${item.data
                        ? new Date(item.data).toLocaleString()
                        : 'Sem data'}
                </td>

                <td>${item.sensor}</td>

                <td>${item.valor}</td>

            </tr>

        `).join('');

    } catch (erro) {

        console.error('Erro:', erro);

        corpo.innerHTML = `
            <tr>
                <td colspan="3">
                    Erro ao carregar dados.
                </td>
            </tr>
        `;
    }
}

// =========================
// CARREGA AO INICIAR
// =========================
window.onload = () => {
    atualizarTabela();
};