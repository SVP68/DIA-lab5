export interface SolarService {
    ID: number;
	ModelName: string;
	Price: number;
	Type: string;
	Power: number;
	Capacity: number;
	Description: string;
	ImageKey?: string;
	VideoKey?: string;
	Status: string;
	IsDeleted: false | true;
}

export interface CartItem {
    service: SolarService;
    quantity: number;
}