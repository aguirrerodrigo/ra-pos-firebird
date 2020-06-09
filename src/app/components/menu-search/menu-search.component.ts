import { Component, ViewChild } from '@angular/core';
import { SearchItem } from '@app/components/search/models/search-item';
import { MenuService } from '@app/services/menu.service';
import { PosService } from '@app/services/pos.service';
import { SearchStrategy } from '@app/components/search/models/search-strategy';
import { TextStartsStrategy } from '@app/components/search/models/text-starts-strategy';
import { WordStartsStrategy } from '@app/components/search/models/word-starts-strategy';
import { AcronymStrategy } from '@app/components/search/models/acronym-strategy';
import { BurgerWordStrategy } from './models/burger-word-strategy';
import { BurgerAcronymStrategy } from './models/burger-acronym-strategy';
import { AddItemSearchComponent } from '@app/components/add-item-search/add-item-search.component';
import { SearchResultItem } from '@app/components/search/models/search-result-item';

@Component({
	selector: 'app-menu-search',
	templateUrl: './menu-search.component.html',
	styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent {
	searchItems: SearchItem[];
	searchStrategies: SearchStrategy[] = [
		new TextStartsStrategy(),
		new WordStartsStrategy(),
		new BurgerWordStrategy(),
		new AcronymStrategy(),
		new BurgerAcronymStrategy()
	];

	@ViewChild('search') search: AddItemSearchComponent;

	constructor(
		private menuService: MenuService,
		private posService: PosService
	) {
		this.menuService.menuChange.subscribe(() => this.updateSearchItems());
		this.posService.orderChange.subscribe(() => this.search.focus());
	}

	private updateSearchItems(): void {
		const buffer: SearchItem[] = [];

		const menu = this.menuService.menu;
		for (const menuItem of menu) {
			buffer.push(new SearchItem(menuItem.name, menuItem));
		}

		this.searchItems = buffer;
	}

	onSelect(searchResultItem: SearchResultItem, quantity: number): void {
		setTimeout(() =>
			this.posService.addItem(searchResultItem.model, quantity)
		);
	}
}
