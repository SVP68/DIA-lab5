import React, { useState } from 'react';
import { Row, Col, Button, Card, Form, Alert, Badge } from 'react-bootstrap';
import type { SolarService } from '../types';

interface DetailProps {
  item: SolarService;
  onAddToCart: (item: SolarService) => void;
  onBack: () => void;
}

// Заглушка, которая гарантированно отобразит картинку СЭС, если поле пустое
const DEFAULT_IMAGE = "https://unsplash.com";

export const SolarServiceDetail: React.FC<DetailProps> = ({ item, onAddToCart, onBack }) => {
  const [sunHours, setSunHours] = useState<number>(4.5);
  const calculatedGen = item.Type === 'panel' ? ((item.Power * sunHours * 0.85) / 1000).toFixed(2) : null;

  return (
    <Card className="p-4 shadow-sm border-0">
      <Row>
        <Col md={5}>
          {/* Исправлен URL для дефолтного изображения */}
          <img 
            src={item.ImageKey || DEFAULT_IMAGE} 
            alt={item.ModelName} 
            className="img-fluid rounded shadow-sm" 
            style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }} 
          />
        </Col>
        <Col md={7} className="d-flex flex-column justify-content-between">
          <div>
            <h2>{item.ModelName}</h2>
            <Badge bg="info" className="mb-3 text-uppercase">{item.Type}</Badge>
            <p className="text-muted fs-5">{item.Description}</p>
            <h3 className="text-success my-3">{item.Price.toLocaleString()} ₽</h3>
            
            <p><strong>Мощность:</strong> {item.Power} Вт</p>
            <p><strong>Ёмкость:</strong> {item.Capacity} Ач</p>

            {calculatedGen && (
              <div className="p-3 bg-light rounded border my-3">
                <h5>📊 Расчет инсоляции для панели</h5>
                <Form.Group className="mb-2">
                  <Form.Label className="small text-muted">Солнечных часов в день:</Form.Label>
                  <Form.Control 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5" 
                    value={sunHours} 
                    onChange={e => setSunHours(parseFloat(e.target.value))} 
                  />
                  <div className="text-end small fw-bold">{sunHours} ч.</div>
                </Form.Group>
                <Alert variant="success" className="py-2 mb-0">
                  Генерация: <strong>{calculatedGen} кВт⋅ч</strong> в сутки.
                </Alert>
              </div>
            )}
          </div>
          <div className="d-flex gap-2 mt-3">
            <Button variant="outline-secondary" onClick={onBack}>Назад</Button>
            
            <Button variant="success" onClick={() => onAddToCart(item)}>
              Добавить в корзину
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};