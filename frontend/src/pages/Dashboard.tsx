export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">Aurélio</h1>
      <p className="text-gray-500 mt-1">Seu parceiro financeiro</p>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Entradas hoje</p>
          <p className="text-2xl font-bold text-green-600 mt-1">R$ 0,00</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Saídas hoje</p>
          <p className="text-2xl font-bold text-red-500 mt-1">R$ 0,00</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Fiado pendente</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
}
