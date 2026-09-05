import React, { useState } from 'react';
import { Table, Button, Card, Alert } from 'react-bootstrap';
import type { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onBack: () => void;
  onClear: () => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, onBack, onClear }) => {
  const [status, setStatus] = useState<string | null>(null);
  
  // ИСПРАВЛЕНО: Обращение через item.service согласно вашему интерфейсу
  const totalSum = cartItems.reduce((sum, item) => sum + item.service.Price * item.quantity, 0);

  // ИСПРАВЛЕНО: Убран реальный fetch к бэкенду Go (требование "без бэкенда")
  const handleOrderSubmit = () => {
    // Сымитируем структуру payload для будущей лабораторной работы
    const payload = {
      items: cartItems.map(i => ({ equipment_id: i.service.ID, quantity: i.quantity }))
    };
    
    // Выводим структуру в консоль, чтобы показать готовность к интеграции на защите
    console.log("Payload для будущей интеграции с Go:", payload);

    // Локальная имитация успешного ответа
    setStatus('Заказ успешно оформлен (демо-режим без бэкенда)!');
    
    // Очищаем корзину через небольшой таймаут, чтобы студент успел увидеть Alert
    setTimeout(() => {
      onClear();
    }, 2000);
  };

  return (
    <Card className="p-4 shadow-sm border-0">
      <h2 className="mb-4">📋 Спецификация заказа</h2>
      {status && <Alert variant={status.includes('успешно') ? 'success' : 'danger'}>{status}</Alert>}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">Корзина пуста</p>
          <Button variant="success" onClick={onBack}>В каталог</Button>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Модель</th>
                <th>Тип</th>
                <th>Цена</th>
                <th>Кол-во</th>
                <th>Итого</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                // ИСПРАВЛЕНО: Ключи и свойства приведены к item.service
                <tr key={item.service.ID}>
                  <td>{item.service.ModelName}</td>
                  <td className="text-capitalize text-muted small">{item.service.Type}</td>
                  <td>{item.service.Price.toLocaleString()} ₽</td>
                  <td>{item.quantity} шт.</td>
                  <td>{(item.service.Price * item.quantity).toLocaleString()} ₽</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Итого: <span className="text-success">{totalSum.toLocaleString()} ₽</span></h4>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={onBack}>Назад</Button>
              <Button variant="danger" onClick={onClear}>Очистить</Button>
              <Button variant="success" onClick={handleOrderSubmit}>Оформить заказ</Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
