import { Table } from "primeng/table";


export class CsvExtractor {

    private isFunction = (obj: any) => !!(obj && obj.constructor && obj.call && obj.apply);

    /**
     * Estrae il contenuto del campo field dal record data passati come parametri
     * @param field Chiave del campo
     * @param data Record da cui estrarre il campo
     * */
    private resolveFieldData(data: any, field: any): any {
        if (data && field) {
            if (this.isFunction(field)) {
                return field(data);
            } else if (field.indexOf(".") === -1) {
                return data[field];
            } else {
                const fields: string[] = field.split(".");
                let value = data;
                for (let i = 0, len = fields.length; i < len; ++i) {
                    if (value == null) {
                        return null;
                    }
                    value = value[fields[i]];
                }
                return value;
            }
        } else {
            return null;
        }
    }

    /**
     * Genera e lancia il download del file CSV di una tabella
     * @param table Tabella
     */
    public exportCsv(table: Table) {
        const data = table.filteredValue || table.value;
        let csv = "\ufeff";

        // headers
        for (let i = 0; i < table.columns.length; i++) {
            const column = table.columns[i];
            if (column.exportable !== false && column.field) {
                csv += "\"" + (column.header || column.field) + "\"";

                if (i < (table.columns.length - 1)) {
                    csv += table.csvSeparator;
                }
            }
        }

        // body
        data.forEach((record, i) => {
            csv += "\n";
            for (let j = 0; j < table.columns.length; j++) {
                const column = table.columns[j];
                if (column.exportable !== false && column.field) {
                    const cellData = [];
                    if (column.subfields) {
                        column.subfields.forEach(element => {
                            cellData.push(this.resolveFieldData(record, element));
                        });
                    } else {
                        cellData.push(this.resolveFieldData(record, column.field));
                    }
                    csv += "\"";      // Delimitatore iniziale del campo
                    for (let k = 0; k < cellData.length; k++) {
                        if (cellData[k] !== null) {
                            cellData[k] = String(cellData[k]).replace(/"/g, "\"\"");
                        } else {
                            cellData[k] = "";
                        }
                        if (column.separator) {
                            csv += cellData[k] + column.separator[k];   // Separatore dei campi calcolati
                        } else {
                            csv += cellData[k];
                        }
                    }
                    csv += "\"";      // Delimitatore finale del campo
                    if (j < (table.columns.length - 1)) {
                        csv += table.csvSeparator;
                    }
                }
            }
        });

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, table.exportFilename + ".csv");
        } else {
            const link = document.createElement("a");
            link.style.display = "none";
            document.body.appendChild(link);
            if (link.download !== undefined) {
                link.setAttribute("href", URL.createObjectURL(blob));
                link.setAttribute("download", table.exportFilename + ".csv");
                link.click();
            } else {
                csv = "data:text/csv;charset=utf-8," + csv;
                window.open(encodeURI(csv));
            }
            document.body.removeChild(link);
        }
    }
}
