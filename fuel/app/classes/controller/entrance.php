<?php
class Controller_Entrance extends Controller
{
	/*
	 * TODO: ‚±‚±‚Å”FØ‚µ‚ÄA room ‚É“ü‚é
	 */
	public function action_index($name)
	{
		$data = array('name' => $name);
		return Response::forge(View::forge('entrance/index', $data));
	}
}
