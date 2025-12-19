import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { formatCurrencyARS, formatCurrencyUSD, getEstadoClass } from "../../lib/utils";

interface PagoCellProps {
    total: number | null;
    pagado: number | null;
    estado: Cirugia["estadoPagoHonorarios"];
    label: string;
    moneda: 'ARS' | 'USD';
}

export const PagoCell: React.FC<PagoCellProps> = ({ total, estado, label, moneda }) => {
    const formatFn: (amount: number | null) => string = moneda === 'ARS' ? formatCurrencyARS : formatCurrencyUSD;
    return (
        <div className={`p-2 rounded-md text-[10px] md:text-xs font-semibold whitespace-nowrap border w-full md:w-auto ${getEstadoClass(estado)}`}>
            <strong className="text-gray-300 block mb-0.5">{label}</strong>
            {formatFn(total)}
        </div>
    );
};

interface MedicoPagoDisplayProps {
    montoHonorarios: number | null;
    montoPresupuesto: number | null;
    participacion: number;
}

export const MedicoPagoDisplay: React.FC<MedicoPagoDisplayProps> = ({ montoHonorarios, montoPresupuesto, participacion }) => {
    const honorarios: number | null = montoHonorarios !== null ? Number(montoHonorarios) * participacion : null;
    const presupuesto: number | null = montoPresupuesto !== null ? Number(montoPresupuesto) * participacion : null;
    return (
        <div className="flex flex-col text-[9px] md:text-[10px] font-medium pt-1"> 
            <span className="text-cyan-400 block truncate">
                {formatCurrencyUSD(honorarios)}
            </span>
            <span className="text-yellow-400 block truncate">
                {formatCurrencyARS(presupuesto)}
            </span>
        </div>
    );
};