import download from "downloadjs";
import { useMemo } from "react";
import { jsonToCSV } from "react-papaparse";
import * as XLSX from "xlsx";
import { alert } from "../coremodules/AlertContainer";

export default function useDownloadJSON() {
  const downloadAsCSV = (data: any[], name: string) => {
    const csv = jsonToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    download(blob, name, "text/csv");
  };

  const downloadAsExcel = (data: any[], name: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { [name]: worksheet }, SheetNames: [name] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const mime =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([excelBuffer], { type: mime });
    download(blob, name, mime);
  };

  const onDownloadAlert = async ({
    title,
    content,
    onDownloadExcel,
    onDownloadCsv,
  }: {
    title?: string;
    content: string;
    onDownloadExcel: () => Promise<void>;
    onDownloadCsv: () => Promise<void>;
  }) => {
    alert({
      title: title ?? "Export",
      content,
      buttons: [
        {
          text: "Excel",
          async onClick() {
            try {
              await onDownloadExcel();
            } catch (error) {
              console.error(error);
            }
          },
        },
        {
          text: "CSV",
          async onClick() {
            try {
              await onDownloadCsv();
            } catch (error) {
              console.error(error);
            }
          },
        },
        { text: "Cancel" },
      ],
    });
  };

  return useMemo(
    () => ({ onDownloadAlert, downloadAsCSV, downloadAsExcel }),
    []
  );
}
