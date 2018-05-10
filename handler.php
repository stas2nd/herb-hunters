<?php
/* Define these, So that WP functions work inside this file */
define('WP_USE_THEMES', false);
require( $_SERVER['DOCUMENT_ROOT'] .'/wp-blog-header.php');
?>
<?php

if(isset($_POST['send']) == '1') {

    $post_title = "Заявка от ".$current_user->user_firstname." "
		.$current_user->user_lastname
		." (".$current_user->ID.")";
	$post_content = $_POST['description'];


	$new_post = array(
		'ID' => '',
		'post_author' => $current_user->ID,
		//'post_category' => array($post_category),
		'post_content' => $post_content,
		'post_title' => $post_title,
		'post_status' => 'publish',
		'post_type'	=> 'project'
	);

	global $switched;
	//switch_to_blog(1);
    if ( is_multisite() ) {
        // Restore the original blog so the sky doesn't fall
        switch_to_blog( 1 );
    }


	
	$post_exists = false;
	
	$args = array(
		'post_type'  => 'project',
		'author'     => $current_user->ID,
		'orderby'       =>  'post_date',
		'order'         =>  'ASC',
		'numberposts' => 1
		);
	
	$current_user_posts = get_posts( $args );
	foreach($current_user_posts as $post){ 
		setup_postdata($post);
		$post_exists = $post->ID; 
	}	
	
	if ($post_exists){
		$post_id = $post_exists;
        wp_update_post(array('ID' => $post_id, 'post_content' => $post_content));
        save_custom_meta_data($post_id);
	} else {
		$post_id = wp_insert_post($new_post);
		$captain_email = get_userdata($current_user->ID)->user_email;
		send_email(5, $captain_email,"");
	}


	wp_redirect("/project/#success");
}

?>