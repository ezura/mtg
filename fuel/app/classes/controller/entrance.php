<?php
class Controller_Entrance extends Controller
{
	/*
	 * TODO: �����ŔF�؂��āA room �ɓ���
	 */
	public function action_index($name)
	{
		$data = array('name' => $name);
		return Response::forge(View::forge('entrance/index', $data));
	}
}
