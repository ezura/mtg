<?php
class Controller_Entrance extends Controller
{
	/*
	 * TODO: ここで認証して、 room に入る
	 */
	public function action_index($name)
	{
		$data = array('name' => $name);
		return Response::forge(View::forge('entrance/index', $data));
	}
}
