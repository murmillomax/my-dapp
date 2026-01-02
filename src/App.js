import { useState } from "react";
import { ethers } from "ethers";
import Visitas from "./Visitas"; // importa tu contador

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  // Estados para inputs
  const [destino, setDestino] = useState("");
  const [monto, setMonto] = useState("");

  // Tu wallet de donaciones (corregida)
  const donationWallet = "0x9d6607B7FaeDeE6471698F7dc60eAb51D0Ded75E";

  async function connectWallet() {
    if (!window.ethereum) return alert("Instala MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);

      const bal = await provider.getBalance(addr);
      setBalance(ethers.formatEther(bal));

      const net = await provider.getNetwork();
      setNetwork(net.name);
    } catch (err) {
      if (err.code === 4001) {
        alert("Conexión rechazada en MetaMask");
      } else {
        console.error(err);
      }
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  }

  async function sendDonation() {
    if (!ethers.isAddress(destino)) {
      return alert("Dirección destino inválida");
    }
    if (!monto || Number(monto) <= 0) {
      return alert("Monto inválido");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const amountWei = ethers.parseEther(monto);
    const feeWei = ethers.parseEther("0.001"); // tarifa fija

    // Enviar al destinatario
    await signer.sendTransaction({
      to: destino,
      value: amountWei - feeWei,
    });

    // Enviar tarifa a tu wallet de donaciones
    await signer.sendTransaction({
      to: donationWallet,
      value: feeWei,
    });

    alert("Transferencia realizada con tarifa de donación");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mi DApp EVM</h1>
      <Visitas /> {/* AQUÍ se carga tu contador */}
      {!account ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <div>
          <p>Cuenta conectada: {account}</p>
          <p>Balance: {balance} ETH</p>
          <p>Red: {network}</p>
          <button onClick={disconnectWallet}>Desconectar Wallet</button>

          <hr />
          <h2>Enviar Donación</h2>
          <input
            type="text"
            placeholder="Dirección destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
          <input
            type="text"
            placeholder="Monto en ETH"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <button onClick={sendDonation}>Enviar con tarifa</button>
        </div>
      )}
    </div>
  );
}

export default App;





