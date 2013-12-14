<?php
class Controller_Room extends Controller
{
	public function action_index()
	{
		return Response::forge(View::forge('room/index'));
	}
}
