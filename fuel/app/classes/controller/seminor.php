<?php
class Controller_Seminor extends Controller
{
	/*public function before()
	{
		if ( is_null(Session::get('user')) )
			Response::redirect('entrance/index');
	}*/
	
	public function action_index()
	{
		$data = array('name' => Input::post('name'),
									'user' => Input::post('user'));
		// login の action_before でチェック 
		return Response::forge(View::forge('seminor/index', $data));
	}
}
