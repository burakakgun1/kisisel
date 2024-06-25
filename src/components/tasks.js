// Tasks.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Input, Button, Calendar, Radio, Modal, notification, Checkbox } from "antd";
import AddTaskForm from "./addTaskForm.js";
import Sil from "./sil.js"; // Sil bileşenini import ettiğinizden emin olun
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("day");
  const [modalVisible, setModalVisible] = useState(false);
  const [reportStartDate, setReportStartDate] = useState(null);
  const [reportEndDate, setReportEndDate] = useState(null);
  const [filteredReport, setFilteredReport] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const styles = document.createElement("style");
    styles.innerHTML = `
      .red-row {
        background-color: red !important;
      }
    `;
    document.head.appendChild(styles);

    return () => {
      document.head.removeChild(styles);
    };
  }, []);

  const fetchData = () => {
    axios
      .get("https://v1.nocodeapi.com/yedek/google_sheets/KvEQPWMtJmOfKcUg?tabId=sayfa1")
      .then((response) => {
        const rows = response.data.data;
        const today = moment().format("YYYY/MM/DD");
        const tasksData = rows.map((row) => ({
          key: row.id,
          title: row.isin_adi,
          type: row.durum === "1" ? "success" : "error",
          isin_adi: row.isin_adi,
          zorunluluk:
            moment(row.bas_tarih, "DD.MM.YYYY").format("YYYY/MM/DD") === today
              ? "Evet"
              : row.zorunluluk === "1"
              ? "Evet"
              : "Hayır",
          is_tanimi: row.is_tanimi,
          bas_tarih: moment(row.bas_tarih, "DD.MM.YYYY").format("YYYY/MM/DD"),
          bitis_tarih: moment(row.bitis_tarih, "DD.MM.YYYY").format("YYYY/MM/DD"),
          bas_saat: moment(row.bas_saat, "HH:mm:ss").format("HH:mm"),
          bitis_saat: moment(row.bitis_saat, "HH:mm:ss").format("HH:mm"),
          durum: row.durum === "1" ? "Tamamlandı" : "Tamamlanmadı",
        }));

        const sortedTasks = tasksData.sort((a, b) => {
          if (a.zorunluluk === "Evet" && b.zorunluluk !== "Evet") return -1;
          if (a.zorunluluk !== "Evet" && b.zorunluluk === "Evet") return 1;
          return 0;
        });

        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks);
        const initialCheckedTasks = {};
        sortedTasks.forEach((task) => {
          initialCheckedTasks[task.key] = task.durum === "Tamamlandı";
        });
        setCheckedTasks(initialCheckedTasks);
      })
      .catch((error) => {
        console.error("Görevler alınırken hata oluştu:", error);
      });
  };

  const handleSearch = () => {
    let filtered = tasks;

    if (startDate && endDate) {
      filtered = tasks.filter((task) => {
        const taskStartDate = moment(task.bas_tarih, "YYYY/MM/DD");
        const taskEndDate = moment(task.bitis_tarih, "YYYY/MM/DD");
        return (
          taskStartDate.isSameOrBefore(endDate) &&
          taskEndDate.isSameOrAfter(startDate)
        );
      });
    } else if (startDate) {
      filtered = tasks.filter((task) => {
        const taskStartDate = moment(task.bas_tarih, "YYYY/MM/DD");
        return taskStartDate.isSameOrAfter(startDate);
      });
    } else if (endDate) {
      filtered = tasks.filter((task) => {
        const taskEndDate = moment(task.bitis_tarih, "YYYY/MM/DD");
        return taskEndDate.isSameOrBefore(endDate);
      });
    }

    setFilteredTasks(filtered);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const getListData = (value) => {
    const dateValue = value.format("YYYY/MM/DD");
    let listData = [];

    tasks.forEach((task) => {
      if (dateValue >= task.bas_tarih && dateValue <= task.bitis_tarih) {
        listData.push({
          type: task.type,
          content: task.title,
          zorunluluk: task.zorunluluk === "Evet" ? "Zorunlu" : "Zorunlu Değil",
        });
      }
    });

    listData.sort((a, b) => b.zorunluluk.localeCompare(a.zorunluluk));

    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <span className={`event-${item.type}`}>
              {item.content} - {item.zorunluluk}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.order) {
      const sortedData = [...filteredTasks].sort((a, b) => {
        if (sorter.order === "ascend") {
          return a.zorunluluk === "Evet" ? -1 : b.zorunluluk === "Evet" ? 1 : 0;
        } else {
          return a.zorunluluk === "Evet" ? 1 : b.zorunluluk === "Evet" ? -1 : 0;
        }
      });
      setFilteredTasks(sortedData);
    }
  };

  const handleReportButtonClick = () => {
    let start, end;

    switch (reportType) {
      case "day":
        start = moment().startOf("day");
        end = moment().endOf("day");
        break;
      case "week":
        start = moment().startOf("week");
        end = moment().endOf("week");
        break;
      case "month":
        start = moment().startOf("month");
        end = moment().endOf("month");
        break;
      case "year":
        start = moment().startOf("year");
        end = moment().endOf("year");
        break;
      default:
        break;
    }

    const filtered = filteredTasks.filter((task) => {
      const taskStart = moment(task.bas_tarih, "YYYY/MM/DD");
      const taskEnd = moment(task.bitis_tarih, "YYYY/MM/DD");

      return (
        taskStart.isSameOrBefore(end) &&
        taskEnd.isSameOrAfter(start)
      );
    });

    setFilteredReport(filtered);

    setReportStartDate(start);
    setReportEndDate(end);

    setModalVisible(true);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSendMail = () => {
    if (reportStartDate && reportEndDate) {
      notification.success({
        message: "Mail Gönderildi!",
        description: `Başlangıç Tarihi: ${reportStartDate.format("YYYY-MM-DD")}, Bitiş Tarihi: ${reportEndDate.format("YYYY-MM-DD")}`,
      });
    } else {
      notification.error({
        message: "Hata!",
        description: "Başlangıç veya bitiş tarihi bulunamadı.",
      });
    }

    handleModalClose();
  };

  const handleCheckboxChange = (key, checked) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: checked }));
    const updatedTasks = tasks.map((task) =>
      task.key === key ? { ...task, durum: checked ? "Tamamlandı" : "Tamamlanmadı" } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleAddTaskModalOpen = () => {
    setAddTaskModalVisible(true);
  };

  const handleAddTaskModalClose = () => {
    setAddTaskModalVisible(false);
  };

  const handleAddTask = (newTaskData) => {
    const updatedTasks = [
      ...tasks,
      {
        ...newTaskData,
        key: tasks.length + 1, // Assuming keys are unique and incremental
      },
    ];

    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setAddTaskModalVisible(false); // Close the Add Task modal
  };

  const handleDelete = (key) => {
    const updatedTasks = tasks.filter((task) => task.key !== key);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const columns = [
    {
      title: "İşin Adı",
      dataIndex: "isin_adi",
      key: "isin_adi",
    },
    {
      title: "Zorunluluk",
      dataIndex: "zorunluluk",
      key: "zorunluluk",
    },
    {
      title: "İş Tanımı",
      dataIndex: "is_tanimi",
      key: "is_tanimi",
    },
    {
      title: "Başlangıç Tarihi",
      dataIndex: "bas_tarih",
      key: "bas_tarih",
      render: (bas_tarih) =>
        moment(bas_tarih, "YYYY/MM/DD").format("YYYY-MM-DD"),
    },
    {
      title: "Başlangıç Saati",
      dataIndex: "bas_saat",
      key: "bas_saat",
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "bitis_tarih",
      key: "bitis_tarih",
      render: (bitis_tarih) =>
        moment(bitis_tarih, "YYYY/MM/DD").format("YYYY-MM-DD"),
    },
    {
      title: "Bitiş Saati",
      dataIndex: "bitis_saat",
      key: "bitis_saat",
    },
    {
      title: "Durum",
      dataIndex: "durum",
      key: "durum",
      render: (durum, record) => (
        <Checkbox
          checked={checkedTasks[record.key]}
          onChange={(e) => handleCheckboxChange(record.key, e.target.checked)}
        />
      ),
    },
    {
      title: "Sil",
      key: "action",
      render: (text, record) => (
        <Sil rowId={record.key} onDelete={() => handleDelete(record.key)} />
      ),
    },
  ];

  return (
    <div className="tasks-container">
      <h1>Yapılacak İşler Listesi</h1>
      <div className="search-bar">
        <Input
          className="search-input"
          onChange={handleStartDateChange}
          value={startDate}
          type="date"
          placeholder="Başlangıç Tarihi (YYYY-MM-DD)"
        />
        <Input
          className="search-input"
          onChange={handleEndDateChange}
          value={endDate}
          type="date"
          placeholder="Bitiş Tarihi (YYYY-MM-DD)"
        />
        <Button type="primary" onClick={handleSearch}>
          Ara
        </Button>
      </div>
      <div className="tasks-wrapper">
        <Table
          className="tasks-table"
          dataSource={filteredTasks}
          columns={columns}
          rowKey={(record) => record.key}
          rowClassName={(record) =>
            record.zorunluluk === "Evet" ? "red-row" : ""
          }
          pagination={{ pageSize: 10 }}
          onChange={handleTableChange}
        />
        <div className="calendar-container">
          <div className="report-section">
            <Radio.Group onChange={handleReportTypeChange} value={reportType}>
              <Radio.Button value="day">Gün</Radio.Button>
              <Radio.Button value="week">Hafta</Radio.Button>
              <Radio.Button value="month">Ay</Radio.Button>
              <Radio.Button value="year">Yıl</Radio.Button>
            </Radio.Group>
            <Button
              className="report-button"
              type="primary"
              onClick={handleReportButtonClick}
            >
              Rapor Al
            </Button>
            <Button
              className="add-task-button"
              type="primary"
              onClick={handleAddTaskModalOpen}
            >
              Görev Ekle
            </Button>
          </div>
          <Calendar className="tasks-calendar" dateCellRender={dateCellRender} />
        </div>
      </div>
      <Modal
        title="Rapor Detayları"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            Tamam
          </Button>,
          <Button key="mail" type="primary" onClick={handleSendMail}>
            Mail Gönder
          </Button>,
        ]}
        width={800}
      >
        {reportStartDate && reportEndDate && (
          <div>
            <p>Başlangıç Tarihi: {reportStartDate.format("YYYY-MM-DD")}</p>
            <p>Bitiş Tarihi: {reportEndDate.format("YYYY-MM-DD")}</p>
          </div>
        )}
        <Table
          dataSource={filteredReport}
          columns={columns}
          rowKey={(record) => record.key}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: "20px" }}
        />
      </Modal>
      <AddTaskForm
        visible={addTaskModalVisible}
        onCancel={handleAddTaskModalClose}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Tasks;

