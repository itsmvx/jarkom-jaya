<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('praktikum_praktikan', function (Blueprint $table) {
            $table->foreignUuid('praktikum_id')->constrained('praktikum')->cascadeOnDelete();
            $table->foreignUuid('praktikan_id')->constrained('praktikan')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['praktikum_id', 'praktikan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('praktikum_praktikan');
    }
};
