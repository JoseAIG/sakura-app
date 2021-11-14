import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnChanges {

  @Input() comments: Comment[]

  @Output() refresh = new EventEmitter<boolean>();

  constructor() { }

  ngOnChanges() { }
  
  doRefresh(){
    this.refresh.emit(true)
  }
}
